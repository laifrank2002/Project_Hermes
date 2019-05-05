function Firm(type)
{
	this.owner = null;
	this.type = type;
	this.jobs = {};
	
	this.employees = [];
	this.employee_count = 0;
	this.max_employees = 0;
	
	var jobs_to_be_added = firm_list[type]["jobs"];
	for(var key in jobs_to_be_added)
	{
		this.jobs[key] = {type:key,hired:0,max:0};
		this.jobs[key]["max"] += jobs_to_be_added[key];
		this.max_employees += jobs_to_be_added[key];
	}
	
	
	this.size = 1;
	this.budget = 100; // starting capital
	
	this.revenue = 0;
	this.expenses = 0;
	this.profit = 0;
	
	this.produced = {};
	for(var key in goods_list)
	{
		this.produced[key] = 0;
	}
	
	this.dead = false;
}

Firm.prototype.BASE_COST = 100;

Firm.prototype.expand = function()
{
	var cost = this.BASE_COST * (this.size);
	if(this.budget >= cost)
	{
		this.budget -= cost;
		this.size += 1;
		
		// add jobs too 
		var jobs_to_be_added = firm_list[this.type]["jobs"];
		for(var key in jobs_to_be_added)
		{
			this.jobs[key]["max"] += jobs_to_be_added[key];
			this.max_employees += jobs_to_be_added[key];
		}	
	}
}

Firm.prototype.downsize = function()
{
	this.size -= 1;
	var jobs_to_be_added = firm_list[this.type]["jobs"];
	for(var key in jobs_to_be_added)
	{
		this.jobs[key]["max"] -= jobs_to_be_added[key];
		this.max_employees -= jobs_to_be_added[key];
	}
	// autofire above cap 
	for(var key in jobs_to_be_added)
	{

		for(var index = 0; index < this.employee_count; index++)
		{
			if(this.jobs[key]["max"] > this.jobs[key]["hired"])
			{
				// fire target employees
				if(this.employees[index].job === key)
				{
					this.fire(this.employees[index]);
				}
			}
			else 
			{
				break;
			}
		}
		
	}
	if(this.size < 1) this.bankrupt();
}

Firm.prototype.bankrupt = function()
{
	this.dead = true;
	this.employees.forEach(employee => this.fire(employee));
	if(this.budget > 0 && this.owner) this.owner.money += this.budget;
}
// beginning of the tick, the production cycle!
Firm.prototype.produce = function(resources)
{
	// we have produced nothing!
	for(var key in goods_list)
	{
		this.produced[key] = 0;
	}
	this.revenue = 0;
	// expenses are equal to the firms' size to prevent huge firms having too many unused employees
	this.expenses = this.size;
	// aggregate jobs 
	for(var key in this.jobs)
	{
		var job = job_list[key];
		var percent_upkeep = 1;
		for(var upkeep_key in job["upkeep"])
		{
			var resource_count = resources[upkeep_key].count;
			var upkeep_requirement = job["upkeep"][upkeep_key] * this.jobs[key]["hired"];
			if(resource_count < upkeep_requirement) 
			{
				var new_percent_upkeep = resource_count / upkeep_requirement;
				// finding Limiting Reagent minimum
				if(new_percent_upkeep < percent_upkeep) percent_upkeep = new_percent_upkeep;
			}
		}

		for(var upkeep_key in job["upkeep"])
		{
			resources[upkeep_key].count -= job["upkeep"][upkeep_key] * this.jobs[key]["hired"] * percent_upkeep;
			this.expenses += job["upkeep"][upkeep_key] * this.jobs[key]["hired"] * percent_upkeep * resources[upkeep_key]["price"];
			resources[upkeep_key].sold += job["upkeep"][upkeep_key] * this.jobs[key]["hired"] * percent_upkeep;
			resources[upkeep_key].demand += job["upkeep"][upkeep_key] * this.jobs[key]["hired"];
		}
		for(var produce_key in job["produce"])
		{
			resources[produce_key].count += job["produce"][produce_key] * this.jobs[key]["hired"] * percent_upkeep;
			resources[produce_key].supply += job["produce"][produce_key] * this.jobs[key]["hired"] * percent_upkeep;
			this.produced[produce_key] += job["produce"][produce_key] * this.jobs[key]["hired"] * percent_upkeep;
			
		}
	}
}

Firm.prototype.receive_payment = function(amount)
{
	this.revenue += amount;
}

Firm.prototype.resolve_accounts = function()
{
	this.profit = this.revenue - this.expenses;
	// aight, now pay some monies to the employees 
	var share_employee = this.profit * 0.8;
	var share_capital = this.profit * 0.2;
	var share_firm = share_capital * 0.85;
	
	this.owner_salary = share_capital * 0.15;
	
	// what, so we can take money from our employees if we're going under?
	if(share_employee > 0)
	{
		this.employees.forEach(employee => employee.money += share_employee/this.max_employees);
	}
	else 
	{
		// the company eats up the cost 
		this.budget += share_employee;
	}
	if(this.owner)
	{
		this.owner.money += this.owner_salary;
		this.budget += share_firm;
	}
	else 
	{
		this.budget += this.owner_salary;
		this.budget += share_firm;
	}
	
	// thence occassionally, by chance and if profitable, expand!
	if(this.profit > 0 && Math.random() < 0.1)
	{
		this.expand();
	}
	else if(this.profit < 0 && this.budget < 100 && Math.random() < 0.05)
	{
		this.downsize();
	}
}

Firm.prototype.has_opening = function()
{
	if(this.employee_count < this.max_employees) return true;
	return false;
}
// semi-randomly hires 
Firm.prototype.hire = function(person)
{
	this.employee_count++;
	this.employees.push(person);
	for (var key in this.jobs)
	{
		var job = this.jobs[key];
		if(job["hired"] < job["max"])
		{
			job["hired"]++;
			person.job = job["type"];
			break;
		}
	}
}
// semi-randomly fires 
Firm.prototype.fire = function(person)
{
	this.employee_count--;
	this.employees = this.employees.filter(employee => employee != person);
	for (var key in this.jobs)
	{
		if(key === person.job)
		{
			var job = this.jobs[key];
			if(job["hired"] > 0)
			{
				job["hired"]--;
				person.job = null;
				person.employer = null;
				break;
			}
		}
	}
}

var firm_list = {
	"farm": {
		"jobs": {"farmer":3,"miller":1},
	},
	"bakery": {
		"jobs": {"baker":2},
	},
	"hunting_camp": {
		"jobs": {"hunter": 3},
	},
	"brewery": {
		"jobs": {"brewer": 2},
	},
}

var job_list = {
	"farmer":{
		"produce": {"grain":0.8},
		"upkeep": {},
	},
	"miller":{
		"produce": {"flour":1.8},
		"upkeep": {"grain":2},
	},
	"baker":{
		"produce": {"bread":0.4},
		"upkeep": {"flour":0.5},
	},
	"hunter":{
		"produce": {"meat":0.4},
	},
	"brewer":{
		"produce": {"beer": 0.8},
		"upkeep": {"grain": 0.2},
	},
}
