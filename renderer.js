var Renderer = (
	function()
	{
		var POPULATION_PYRAMID_HEIGHT = 400;
		var POPULATION_PYRAMID_WIDTH = 400;
		var POPULATION_PYRAMID_CENTER_MARGIN = 40;
		var POPULATION_PYRAMID_BAR_TOP_MARGIN = 0;
		
		var population_pyramid = null;
		var population_pyramid_context = null;
		
		var max_count = 0;
		
		return {
			initialize: function()
			{
				population_pyramid = document.getElementById("population_pyramid");
				population_pyramid.height = POPULATION_PYRAMID_HEIGHT;
				population_pyramid.width = POPULATION_PYRAMID_WIDTH;
				
				population_pyramid_context = population_pyramid.getContext("2d");
			},
			
			draw: function()
			{
				draw_population_pyramind();
			},
			
		}
		
		// draws one very specific canvas
		function draw_population_pyramind() 
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
	}
)();