function Person()
{
	this.name = "";
	this.age = 0;
	this.gender = Math.random() > 0.5 ? "m" : "f";
	// birthday
	this.birthday = Game.data["statistics"]["time"]["day"];
	
	this.health = 0.99;
	this.money = 0;
	this.satisfaction = 1;
	this.children = [];
	
	this.active = false;
	
	this.job = null;
	this.employer = null;
	this.house = null;
	
	this.firm = null; // yeah, you can only own ONE firm.
	
	this.dead = false;
}

Person.prototype.BASE_CONSUMPTION_AMOUNT = 0.02;

Person.prototype.start_new_firm = function(firms, firm_profit_brackets)
{
	if(this.money > Firm.prototype.BASE_COST && !this.firm)
	{
		// eye which firm makes the most profit
		var max_profit = 0;
		var type = "farm"; // default 
		
		for(var key in firm_profit_brackets)
		{
			// we add random to prevent all the firms from being the same and bankruptcy ensuing.
			if(firm_profit_brackets[key].profit > max_profit || Math.random() > 0.5)
			{
				max_profit = firm_profit_brackets[key].profit;
				type = key;
			}
		}
		this.firm = new Firm(type);
		this.firm.owner = this;
		firms.push(this.firm);
	}
}

Person.prototype.consume = function(resources)
{
	// base 1 satisfication
	this.satisfaction = 1;
	// a person requires food to survive
	var eaten = false;
	var food_variety = 0;
	// and now, for other things!
	var furnishing_variety = 0;
	var alcohol_variety = 0;
	
	for(var key in resources)
	{
		var resource = resources[key];
		var amount_consumed = Person.prototype.BASE_CONSUMPTION_AMOUNT;

		if(resource.type === "food")
		{
			resource.demand += amount_consumed;
			if(resource.count >= amount_consumed)
			{
				resource.count -= amount_consumed;
				// we won't make you pay for things yet, but we will impose a demand on it!
				resource.sold += amount_consumed;
				eaten = true;
				food_variety += 1;
			}
		}
		else if(resource.type === "alcohol")
		{
			// you can drink yourself to death! I'm sorry, a bit too macabre?
			resource.demand += amount_consumed;
			if(resource.count >= amount_consumed)
			{
				resource.count -= amount_consumed;
				// we won't make you pay for things yet, but we will impose a demand on it!
				resource.sold += amount_consumed;
				alcohol_variety += 1;
			}
		}
	}
	
	if(eaten && this.health < 1)
	{
		this.health += 0.02 * food_variety;
	}
	else
	{
		this.health -= 0.01;
	}
	
	this.health -= 0.001 * alcohol_variety;
	this.satisfaction += 0.8 * alcohol_variety;
}

Person.prototype.birth = function()
{
	var child = new Person();
	this.children.push(child);
	return child;
}

Person.prototype.get_a_job = function(firms)
{
	// this.job = randomProperty(job_list);
	// 
	for(var index = 0; index < firms.length; index++)
	{
		if(firms[index].has_opening())
		{
			firms[index].hire(this);
			this.employer = firms[index];
			return true; // found a job!
		}
	}
	return false; // false means unemployment still
}

Person.prototype.die = function()
{
	if(this.employer)
	{
		this.employer.fire(this);
	}
	
	// inheritence
	var found_heir = true;
	for(var index = 0; index < this.children.length; index++)
	{
		if(!this.children[index].dead)
		{
			this.children[index].money += this.money; // money is of course transferred
			found_heir = true;
			break;
		}
	}
	if(!found_heir)
	{
		Game.distribute_money(this.money);
	}
	// all firms will be broken up and passed to the world 
	if(this.firm)
	{
		this.firm.owner = null;
		// of course, the owner's share is worth *something*
		Game.distribute_money(this.firm.size * Firm.prototype.BASE_COST);
	}
	this.dead = true;
}