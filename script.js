// important variables
var Game = (
	function()
	{
		// hard population cap to prevent computers from crashing.
		var POPULATION_LIMIT = 99999;
		
		// data
		var data = {};
		data["agents"] = {};
		var agents = data["agents"];
		data["goods"] = {};
		data["statistics"] = {};
		// resources - yes, it is another huge array
		var resources = [];
		
		// 1 time = 1 day
		var time;
		// population 
		var fertility_rate = 8;
		// brackets
		// for stats
		var age_brackets = [];
		var firm_profit_brackets = [];
		// brackets included on both sides
		
		
		// UI elements 
		var UI_population_display;
		var UI_population_total;
		var UI_population_actives;
		var UI_population_unemployed;
		var UI_population_unemployment_rate;
		
		var UI_goods_display;
		var UI_goods_table;
		var UI_goods_table_head;
		var UI_goods_table_head_row;
		var UI_goods_table_head_headers = [];
		var UI_goods_table_head_headers_text = ["Good","Number","Demand","Supply","Sold"];
		var UI_goods_table_body;
		var UI_goods_table_body_row = [];
		var UI_goods_table_body_row_cells = [];
		
		var UI_firms_display;
		var UI_firms_table;
		var UI_firms_table_head;
		var UI_firms_table_head_row;
		var UI_firms_table_head_headers = [];
		var UI_firms_table_head_headers_text = ["Type","Number","Size","Profit"];
		var UI_firms_table_body;
		var UI_firms_table_body_row = [];
		var UI_firms_table_body_row_cells = [];
		
		function initialize_UI()
		{
			// population_display
			UI_population_display = document.getElementById("population_display");
			
			UI_population_total = document.createElement("div");
			UI_population_display.appendChild(UI_population_total);
			UI_population_actives = document.createElement("div");
			UI_population_display.appendChild(UI_population_actives);
			UI_population_unemployed = document.createElement("div");
			UI_population_display.appendChild(UI_population_unemployed);
			UI_population_unemployment_rate = document.createElement("div");
			UI_population_display.appendChild(UI_population_unemployment_rate);
			
			
			// goods_display
			UI_goods_display = document.getElementById("goods_display");
			
			UI_goods_table = document.createElement("table");
			UI_goods_display.appendChild(UI_goods_table);
			
			UI_goods_table_head = document.createElement("thead");
			UI_goods_table_head_row = document.createElement("tr");
			
			for(var index = 0; index < UI_goods_table_head_headers_text.length; index++)
			{
				var header = document.createElement("th");
				header.innerHTML = UI_goods_table_head_headers_text[index];
				UI_goods_table_head_headers.push(header);
				UI_goods_table_head_row.appendChild(header);
			}
			
			UI_goods_table_head.appendChild(UI_goods_table_head_row);
			UI_goods_table.appendChild(UI_goods_table_head);
			
			// und now do each row for each body element 
			UI_goods_table_body = document.createElement("tbody");
			var index = 0;
			for(var key in goods_list)
			{
				UI_goods_table_body_row[index] = document.createElement("tr");
				UI_goods_table_body_row_cells[index] = [];
				// now create rows!
				UI_goods_table_body_row_cells[index][0] = document.createElement("td");
				UI_goods_table_body_row_cells[index][0].innerHTML = key;
				UI_goods_table_body_row[index].appendChild(UI_goods_table_body_row_cells[index][0]);
				
				UI_goods_table_body_row_cells[index][1] = document.createElement("td");
				UI_goods_table_body_row_cells[index][1].innerHTML = "0";
				UI_goods_table_body_row[index].appendChild(UI_goods_table_body_row_cells[index][1]);
				
				UI_goods_table_body_row_cells[index][2] = document.createElement("td");
				UI_goods_table_body_row_cells[index][2].innerHTML = "0";
				UI_goods_table_body_row[index].appendChild(UI_goods_table_body_row_cells[index][2]);
				
				UI_goods_table_body_row_cells[index][3] = document.createElement("td");
				UI_goods_table_body_row_cells[index][3].innerHTML = "0";
				UI_goods_table_body_row[index].appendChild(UI_goods_table_body_row_cells[index][3]);
				
				UI_goods_table_body_row_cells[index][4] = document.createElement("td");
				UI_goods_table_body_row_cells[index][4].innerHTML = "0";
				UI_goods_table_body_row[index].appendChild(UI_goods_table_body_row_cells[index][4]);
				
				UI_goods_table_body.appendChild(UI_goods_table_body_row[index]);
				index++;
			}
			UI_goods_table.appendChild(UI_goods_table_body);
			
			
			// firms display!
			UI_firms_display = document.getElementById("firms_display");
			
			UI_firms_table = document.createElement("table");
			UI_firms_display.appendChild(UI_firms_table);
			
			UI_firms_table_head = document.createElement("thead");
			UI_firms_table_head_row = document.createElement("tr");
			
			for(var index = 0; index < UI_firms_table_head_headers_text.length; index++)
			{
				var header = document.createElement("th");
				header.innerHTML = UI_firms_table_head_headers_text[index];
				UI_firms_table_head_headers.push(header);
				UI_firms_table_head_row.appendChild(header);
			}
			
			UI_firms_table_head.appendChild(UI_firms_table_head_row);
			UI_firms_table.appendChild(UI_firms_table_head);
			
			UI_firms_table_body = document.createElement("tbody");
			var index = 0;
			for(var key in firm_list)
			{
				UI_firms_table_body_row[index] = document.createElement("tr");
				UI_firms_table_body_row_cells[index] = [];
				// now create rows!
				UI_firms_table_body_row_cells[index][0] = document.createElement("td");
				UI_firms_table_body_row_cells[index][0].innerHTML = key;
				UI_firms_table_body_row[index].appendChild(UI_firms_table_body_row_cells[index][0]);
				
				UI_firms_table_body_row_cells[index][1] = document.createElement("td");
				UI_firms_table_body_row_cells[index][1].innerHTML = "0";
				UI_firms_table_body_row[index].appendChild(UI_firms_table_body_row_cells[index][1]);
				
				UI_firms_table_body_row_cells[index][2] = document.createElement("td");
				UI_firms_table_body_row_cells[index][2].innerHTML = "0";
				UI_firms_table_body_row[index].appendChild(UI_firms_table_body_row_cells[index][2]);
				
				UI_firms_table_body_row_cells[index][3] = document.createElement("td");
				UI_firms_table_body_row_cells[index][3].innerHTML = "0";
				UI_firms_table_body_row[index].appendChild(UI_firms_table_body_row_cells[index][3]);
								
				UI_firms_table_body.appendChild(UI_firms_table_body_row[index]);
				index++;
			}
			UI_firms_table.appendChild(UI_firms_table_body);

		}
		
		return {
			
			get data() {return data},
			get age_brackets() {return age_brackets},
			initialize: function()
			{
				// first there was time 
				data["statistics"]["time"] = {day: 0};
				time = data["statistics"]["time"];
				
				// and then, there was statistics 
				var age_interval = 2;
				var ending = 0;
				for(var index = 0; index < 100; index+=age_interval)
				{
					age_brackets.push({begin:index,end:index+age_interval-1,count:0,male:0,female:0});
					ending = index+age_interval-1;
				}
				age_brackets.push({begin:ending+1, end: null,count:0,male:0,female:0});
		
				firm_profit_brackets = {};
				for(var key in firm_list)
				{
					firm_profit_brackets[key] = 
					{
						name: key,
						profit: 0,
						count: 0,
						total_size: 0,
					};
				}
				
				// then was created man (and woman!)
				var population = [];
				for(var index = 0; index < 500; index++)
				{
					var person = new Person();
					person.age = Math.round(Math.random() * 30);
					person.birthday = Math.round(Math.random()*365) - 365;
					population.push(person);
				}
				
				population.forEach(person =>
				{
					if(person.age >= 18 && person.gender === "m")
					{
						person.active = true;
					}
					else 
					{
						person.active = false;
					}
				});
				data["agents"]["population"] = population;
				
				// then was created firms 
				data["agents"]["firms"] = [];
				for(var index = 0; index < 5; index++)
				{
					var type = "farm";
					var firm = new Firm(type);
					data["agents"]["firms"].push(firm);
				}
				for(var index = 0; index < 10; index++)
				{
					var type = "bakery";
					var firm = new Firm(type);
					data["agents"]["firms"].push(firm);
				}
				
				//console.table(population);
				data["goods"] = {};
				Object.getOwnPropertyNames(goods_list).forEach(name =>
				{
					data["goods"][name] = {count: 0, owned: 0, type: goods_list[name].type, price: goods_list[name]["base_price"],supply :0,sold: 0, demand: 0, max: 10000};
				});
				
				resources = data["goods"];
				
				// other handlers
				// und we created UI
				initialize_UI();
				Renderer.initialize();
				
				Game.update();
			},
			
			tick: function(lapse)
			{
				// reset market supply 'n' demand 
				for(var key in data["goods"])
				{
					var good = data["goods"][key];
					good.supply = 0;
					good.demand = 0;
					good.sold = 0;
				}
				
				// each firm, start producing!
				agents["firms"].forEach(firm => firm.produce(data["goods"]));
				
				// on a daily basis, produce and then consume
				var all_jobs_filled = false;
				agents["population"].forEach(person =>
				{
					// are you active? have no job? have no fear! we'll find you one!
					if(person.active)
					{
						if(!all_jobs_filled)
						{
							if(!person.job) 
							{
								if(!person.get_a_job(agents["firms"]))
								{
									all_jobs_filled = true;
								}
							}
						}
					}
					
					// person.produce(resources);
					person.consume(resources);
					
					// is it your birthday?
					if(person.birthday%365 === time.day%365)
					{
						person.age++
						
						// check if they became active or not then 
						if(person.age >= 18 && person.gender === "m")
						{
							person.active = true;
						}
						else 
						{
							person.active = false;
						}
						person.health -= ((person.age*person.age)/400) * Math.random();
					}
					
					// birth and kill pops every day 
					if(agents["population"].length < POPULATION_LIMIT && person.gender === "f" && (fertility_rate/22)/365 > Math.random() && person.age > 18 && person.age < 40)
					{
						agents["population"].push(person.birth());
					}
					
					if((1 - person.health)/365 > Math.random()) person.die();
					
				});
				agents["population"] = agents["population"].filter(person => !person.dead);
				// cull over max resources 
				for(var key in resources)
				{
					var resource = resources[key];
					if(resource.count > resource.max) resource.count = resource.max;
				}
				
				// and now we calculate how much money you actually receive
				// wherehence demand meets supply, of course 
				// thence, you shall receive thy payment
				agents["firms"].forEach(firm =>
				{
					for(var key in firm.produced)
					{
						// that's the share of production and thus share of amount sold
						var production_share = firm.produced[key]/resources[key].supply;
						if(resources[key].supply === 0) production_share = 0;						
						var payment = production_share * resources[key].sold * resources[key].price;
						
						
						firm.receive_payment(payment);
					}
				});
				// and finally, pay your bloody employees!
				// we'll sum up the firms of each particular industry as well
				for(var key in firm_list)
				{
					firm_profit_brackets[key].profit = 0;
					firm_profit_brackets[key].count = 0;
					firm_profit_brackets[key].total_size = 0;
				}
				agents["firms"].forEach(firm => 
				{
					firm.resolve_accounts();
					firm_profit_brackets[firm.type].profit += firm.profit;
					firm_profit_brackets[firm.type].count += 1;
					firm_profit_brackets[firm.type].total_size += firm.size;
				});
				// thence divide to average 
				for(var key in firm_list)
				{
					firm_profit_brackets[key].profit = firm_profit_brackets[key].profit/firm_profit_brackets[key].count;
					if(firm_profit_brackets[key].count === 0) firm_profit_brackets[key].profit = 0;
				}
				// Game.update();
				time.day++;
			},
			update: function()
			{
				// precongnited calculations (shh, I'm lazy)
				var actives = 0;
				var unemployed_count = 0;
				// bracketer tool 
				age_brackets.forEach(bracket => 
				{
					bracket.count = 0;
					bracket.male = 0;
					bracket.female = 0;
				});
				
				agents["population"].forEach(person =>
				{
					// age brackets;
					age_brackets.forEach(bracket => 
					{
						// arbitrary ends
						if(person.age >= bracket.begin && (person.age <= bracket.end || bracket.end === null))
						{
							bracket.count++;
							person.gender === "m" ? bracket.male++ : bracket.female++;
							
							return;
						}
					});
					// other stats 
					if(person.active)
					{
						actives++;
						if(!person.job)
						{
							unemployed_count++;
						}
					}
				});
				
				// bracketer tool for firms!
				
				// now actually update
				Renderer.draw();
				
				// HTML
				UI_population_total.innerHTML = "Total population: " + agents["population"].length;
				UI_population_actives.innerHTML = "Actives: " + actives;
				UI_population_unemployed.innerHTML = "Unemployed: " + unemployed_count;
				UI_population_unemployment_rate.innerHTML = "Unemployment rate: " + ((1 - unemployed_count/actives) * 100).toFixed(2) + "%";
				var index = 0;
				for(var key in goods_list)
				{
					UI_goods_table_body_row_cells[index][1].innerHTML = data["goods"][key].count.toFixed(2);					
					UI_goods_table_body_row_cells[index][2].innerHTML = data["goods"][key].demand.toFixed(2);					
					UI_goods_table_body_row_cells[index][3].innerHTML = data["goods"][key].supply.toFixed(2);
					UI_goods_table_body_row_cells[index][4].innerHTML = data["goods"][key].sold.toFixed(2);
					index++;
				}
				
				var index = 0;
				for(var key in firm_profit_brackets)
				{
					UI_firms_table_body_row_cells[index][1].innerHTML = firm_profit_brackets[key].count.toFixed(0);					
					UI_firms_table_body_row_cells[index][2].innerHTML = firm_profit_brackets[key].total_size.toFixed(0);					
					UI_firms_table_body_row_cells[index][3].innerHTML = firm_profit_brackets[key].profit.toFixed(2);					
					index++;
				}
			},
			log_stats: function()
			{
				/*
				var actives = 0;
				// bracketer tool 
				age_brackets.forEach(bracket => 
				{
					bracket.count = 0;
					bracket.male = 0;
					bracket.female = 0;
				});
				
				agents["population"].forEach(person =>
				{
					// age brackets;
					age_brackets.forEach(bracket => 
					{
						// arbitrary ends
						if(person.age >= bracket.begin && (person.age <= bracket.end || bracket.end === null))
						{
							bracket.count++;
							person.gender === "m" ? bracket.male++ : bracket.female++;
							
							return;
						}
					});
					// other stats 
					if(person.active) actives++;
					
				});
				console.table(age_brackets);
				console.log("There are " + actives + " actives out of " + agents["population"].length + " people in total.");
				*/
				// console.table(agents["population"]);
				console.table(resources);
				
			},
			
			// distribute random earnings, state money, etc
			distribute_money: function(amount)
			{
				// lottery!
				var number = Math.floor*(Math.random() * agents["population"].length);
				population[number].money += amount;
			},
			
			pass_time_and_log: function(time)
			{
				for(var i = 0; i < time; i++){Game.tick()};
				Game.log_stats();
			},
		}; // end RETURN
		
	}
)();

// constants

var goods_list = {
	"grain" : {
		"type": "raw",
		"base_price": 0.5,
	},
	"flour": {
		"type": "processed",
		"base_price": 0.8,
	},
	"bread":{
		"type": "food",
		"base_price": 5,
	},
	
}

// utils 
var randomProperty = function (object) {
    var keys = Object.keys(object)
    return object[keys[keys.length * Math.random() << 0]];
};
