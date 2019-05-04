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
	this.home = null;
	
	this.dead = false;
}

Person.prototype.BASE_CONSUMPTION_AMOUNT = 0.01;

Person.prototype.consume = function(resources)
{
	// a person requires food to survive
	var eaten = false;
	for(var key in resources)
	{
		var resource = resources[key];
		var amount_consumed = Person.prototype.BASE_CONSUMPTION_AMOUNT;
		if(resource.type === "food" && resource.count >= amount_consumed)
		{
			resource.count -= amount_consumed;
			// we won't make you pay for things yet, but we will impose a demand on it!
			resource.sold += amount_consumed;
			resource.demand += amount_consumed;
			eaten = true;
			break;
		}
	}
	
	if(eaten && this.health < 1)
	{
		this.health += 0.02;
	}
	else
	{
		this.health -= 0.01;
	}
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
	
	this.dead = true;
}