var Renderer = (
	function()
	{
		// pop pyramid 
		var POPULATION_PYRAMID_HEIGHT = 400;
		var POPULATION_PYRAMID_WIDTH = 400;
		var POPULATION_PYRAMID_CENTER_MARGIN = 40;
		var POPULATION_PYRAMID_BAR_TOP_MARGIN = 0;
		
		// pop growth graph
		var POPULATION_GRAPH_HEIGHT = 400;
		var POPULATION_GRAPH_WIDTH = 800;
		
		// pop pyramid
		var population_pyramid = null;
		var population_pyramid_context = null;
		
		// pop growth graph
		var population_growth = null;
		var population_growth_context = null;
		var population_growth_graph = null;
		var population_growth_table = null;
		
		var max_count = 0;
		
		return {
			initialize: function()
			{
				population_pyramid = document.getElementById("population_pyramid");
				population_pyramid.height = POPULATION_PYRAMID_HEIGHT;
				population_pyramid.width = POPULATION_PYRAMID_WIDTH;
				population_pyramid_context = population_pyramid.getContext("2d");
				
				population_growth = document.getElementById("population_growth");
				population_growth.height = POPULATION_GRAPH_HEIGHT;
				population_growth.width = POPULATION_GRAPH_WIDTH;
				population_growth_context = population_growth.getContext("2d");
				
				population_growth_table = new Table("population_growth",["population","time"]);
				population_growth_graph = new Graph("linegraph",population_growth_table
					,POPULATION_GRAPH_WIDTH,POPULATION_GRAPH_HEIGHT);
				
			},
			
			draw: function()
			{
				// delegate to canvases
				draw_population_pyramid();
				draw_population_growth();
			},
			
			// receiver functions 
			receive_population_growth_data: function(data)
			{
				var MAX_HEIGHT = 100;
				if(population_growth_graph.data.get_height() <= MAX_HEIGHT)
				{
					population_growth_graph.add_row([data.time, data.population]);
				}
				else 
				{
					population_growth_graph.queue_row([data.time, data.population]);
				}
			},
		}
		
		// draws one very specific canvas
		function draw_population_pyramid() 
		{
			var context = population_pyramid_context;
			var brackets = Game.age_brackets;
			
			// clear before we draw anything 
			context.clearRect(0,0,POPULATION_PYRAMID_WIDTH,POPULATION_PYRAMID_HEIGHT);
			/*
			context.beginPath();
			context.rect(0,0,POPULATION_PYRAMID_WIDTH,POPULATION_PYRAMID_HEIGHT);
			context.rect(0,0,(POPULATION_PYRAMID_WIDTH - POPULATION_PYRAMID_CENTER_MARGIN)/2,POPULATION_PYRAMID_HEIGHT);
			context.rect((POPULATION_PYRAMID_WIDTH + POPULATION_PYRAMID_CENTER_MARGIN)/2,0,(POPULATION_PYRAMID_WIDTH - POPULATION_PYRAMID_CENTER_MARGIN)/2,POPULATION_PYRAMID_HEIGHT);
			context.stroke();
			*/
			// now draw the actual pyramid!
			var bar_height = (POPULATION_PYRAMID_HEIGHT-(POPULATION_PYRAMID_BAR_TOP_MARGIN * brackets.length))/brackets.length;
			var max_bar_width = (POPULATION_PYRAMID_WIDTH - POPULATION_PYRAMID_CENTER_MARGIN)/2;
			// dynamically adjusted!
			var max_male = Math.max.apply(null, brackets.map(bracket => {return bracket['male']}));
			var max_female = Math.max.apply(null, brackets.map(bracket => {return bracket['female']}));
			
			// or rather, unisex?
			var current_max_count = Math.max.apply(null
				,brackets.map(bracket => {return bracket['male']}).concat(brackets.map(bracket => {return bracket['female']})));
			if(current_max_count > max_count) max_count = current_max_count;
			var top_pixel = 0;
			
			brackets.forEach(bracket =>
			{
				// male 
				context.beginPath();
				// bloody browsers!
				context.rect(Math.round(max_bar_width - bracket.male/max_count * max_bar_width) + 0.5
					,Math.round(top_pixel) + 0.5
					,Math.round(bracket.male/max_count * max_bar_width)
					,Math.round(bar_height));
				context.fillStyle="#77aaff";
				context.strokeStyle="#77aaff";
				context.fill();
				context.stroke();
				// draw the textual brackets
				context.beginPath();
				context.fillStyle="black";
				context.fillText(" " + bracket.begin + " - " + bracket.end
					,(POPULATION_PYRAMID_WIDTH - POPULATION_PYRAMID_CENTER_MARGIN)/2
					,top_pixel + 8);
				context.stroke();
				// female
				context.beginPath();
				context.rect((Math.round(POPULATION_PYRAMID_WIDTH + POPULATION_PYRAMID_CENTER_MARGIN)/2) + 0.5
					,Math.round(top_pixel) + 0.5
					,Math.round(bracket.female/max_count * max_bar_width)
					,Math.round(bar_height));
				context.fillStyle="pink";
				context.strokeStyle="pink";
				context.fill();
				context.stroke();
				top_pixel += bar_height + POPULATION_PYRAMID_BAR_TOP_MARGIN;
			});
						
		}
		
		// draws the other very specific canvas 
		function draw_population_growth() 
		{
			var context = population_growth_context;
			
			// clear before we draw anything 
			context.clearRect(0,0,POPULATION_GRAPH_WIDTH,POPULATION_GRAPH_HEIGHT);
			
			population_growth_graph.draw(context);
			
		}
		
	}
)();