function Graph(type, data,width,height)
{
	this.type = type || "scatterplot";
	this.data = data;
	
	this.x = 0 + Graph.prototype.DEFAULT_MARGIN_X;
	this.y = 0;
	this.width = width - Graph.prototype.DEFAULT_MARGIN_X;
	this.height = height - Graph.prototype.DEFAULT_MARGIN_Y;
	
	this.normalize();
	
}

// define constants 

Graph.prototype.DEFAULT_MARGIN_X = 50;
Graph.prototype.DEFAULT_MARGIN_Y = 50;

Graph.prototype.DEFAULT_DECIMAL_PLACES = 2;
Graph.prototype.AXIS_X_LABELS = 5;
Graph.prototype.AXIS_Y_LABELS = 5;

// adds a new row to the data 
Graph.prototype.add_row = function(row)
{
	this.data.add_row(row);
	this.normalize(); // normalize in order to display the data 
}

// quenes up a new data 
// removes the last and adds in the first!
Graph.prototype.queue_row = function(row)
{
	this.data.queue_row(row);
	this.normalize(); // normalize in order to display the data 
}

// sets a new data table 
Graph.prototype.set_data = function(data)
{
	this.data = data;
	this.normalize(); // normalize in order to display the data 
}

// prepares data to be displayed
Graph.prototype.normalize = function()
{
	if (this.type === "scatterplot" || this.type === "linegraph" || this.type === "filled_linegraph")
	{
		// only if more than two cols 
		if (this.data.columns.length < 2) return;
		// AND height is at least 1
		if (this.data.get_height() < 1) return;
		this.axis = {};
		// Object.create is a middle copier
		// That means it'll copy all the objects in the array, but the objects inside of that!
		// We'll only go one layer deep with this thing, which is all we really need for these purposes.
		this.axis.x = Object.create(this.data.columns[0].cells);
		this.axis.y = Object.create(this.data.columns[1].cells);
		
		// only works for numerical data 
		if (typeof this.axis.x[0] === "number")
		{
			this.axis.max_x = 0;
			for(var index = 0; index < this.axis.x.length; index++)
			{
				if (this.axis.max_x < this.axis.x[index]) this.axis.max_x = this.axis.x[index]; 
			}
			
			this.axis.min_x = Infinity;
			for(var index = 0; index < this.axis.x.length; index++)
			{
				if (this.axis.min_x > this.axis.x[index]) this.axis.min_x = this.axis.x[index]; 
			}
			// set axis x 
			this.axis.x = [];
			for(var index = 0; index < Graph.prototype.AXIS_X_LABELS; index++)
			{
				this.axis.x.push((((this.axis.max_x - this.axis.min_x) / Graph.prototype.AXIS_X_LABELS) * index + this.axis.min_x).toFixed(Graph.prototype.DEFAULT_DECIMAL_PLACES)); 
			}
		}
		else 
		{
			this.axis.max_x = null;
		}
		//
		if (typeof this.axis.y[0] === "number")
		{
			this.axis.max_y = 0;
			for(var index = 0; index < this.axis.y.length; index++)
			{
				if (this.axis.max_y < this.axis.y[index]) this.axis.max_y = this.axis.y[index]; 
			}
			
			this.axis.min_y = Infinity;
			for(var index = 0; index < this.axis.y.length; index++)
			{
				if (this.axis.min_y > this.axis.y[index]) this.axis.min_y = this.axis.y[index]; 
			}
			
			// set axis y
			this.axis.y = [];
			for(var index = 0; index < Graph.prototype.AXIS_Y_LABELS; index++)
			{
				this.axis.y.push((((this.axis.max_y - this.axis.min_y) / Graph.prototype.AXIS_Y_LABELS) * index + this.axis.min_y).toFixed(Graph.prototype.DEFAULT_DECIMAL_PLACES)); 
			}
		}
		else 
		{
			this.axis.max_y = null;
		}
		
		// set plots points
		this.points = [];
		for(var index = 0; index < this.data.columns[0].cells.length; index++)
		{
			var point = new Point(((this.data.columns[0].cells[index]  - this.axis.min_x) * (this.width / (this.axis.max_x - this.axis.min_x)))
				,((this.data.columns[1].cells[index] - this.axis.min_y) * (this.height / (this.axis.max_y - this.axis.min_y))))
			//Engine.log(this.data.columns[1].cells[index]);
			this.points.push(point);
		}
		//
	}
	
}

Graph.prototype.draw = function(context)
{
	var AXIS_X_OFFSET_Y = 20;
	var AXIS_Y_OFFSET_X = -50;
	
	if (this.data.get_height() < 1) return;
	// reset 
	context.fillStyle = "black";
	context.strokeStyle = "grey";
	
	// border 
	context.beginPath();
	context.rect(this.x,this.y,this.width,this.height);
	context.stroke();
	
	// first draw gridations around x and y
	
	for(var index = 0; index < this.axis.x.length; index++)
	{
		context.beginPath();
		context.moveTo(this.x + (this.width/this.axis.x.length * index)
			,this.y + 0);
		context.lineTo(this.x + (this.width/this.axis.x.length * index)
			,this.y + this.height);
		context.stroke();
	}
	
	for(var index = 0; index < this.axis.y.length; index++)
	{
		context.beginPath();
		context.moveTo(this.x
			,this.y + this.height - (this.height/this.axis.y.length * index));
		context.lineTo(this.x + this.width
			,this.y + this.height - (this.height/this.axis.y.length * index));
		context.stroke();
	}
	
	// now draw minor gridations 
	// RESERVED
	
	// draw x axis 
	for(var index = 0; index < this.axis.x.length; index++)
	{ 
		// important, adjust for width using measureText, this centers the text.
		context.fillText(this.axis.x[index]
			,this.x + (this.width/this.axis.x.length * index) - context.measureText((this.axis.x[index])).width/2
			,this.y + this.height + AXIS_X_OFFSET_Y);
	}
	// draw max x
	var label = this.axis.max_x.toFixed(Graph.prototype.DEFAULT_DECIMAL_PLACES);
	context.fillText(label
		,this.x + (this.width) - context.measureText(label).width/2
		,this.y + this.height + AXIS_X_OFFSET_Y);
	
	// draw y axis 
	for(var index = 0; index < this.axis.y.length; index++)
	{
		context.fillText(this.axis.y[index]
			,this.x + AXIS_Y_OFFSET_X
			,this.y + this.height - (this.height/this.axis.y.length * index));
	}
	// draw max y
	context.fillText(this.axis.max_y.toFixed(Graph.prototype.DEFAULT_DECIMAL_PLACES)
			,this.x + AXIS_Y_OFFSET_X
			,this.y + this.height - (this.height));
			
	// rendering graphs 
	if(this.type === "scatterplot")
	{
		context.strokeStyle = "black";
		// draw each point 
		for(var index = 0; index < this.points.length; index++)
		{
			context.beginPath();
			context.rect(this.x + this.points[index].x - 3 
				,this.y + this.height - this.points[index].y - 3 // flip y 
				, 6, 6); // draw a rect because it's faster on the javascript machine
			context.stroke();
		}
	}
	else if(this.type === "linegraph")
	{
		context.strokeStyle = "red";
		context.beginPath();
		// draw each line 
		for(var index = 0; index < this.points.length; index++)
		{
			if(index === 0)
			{
				context.moveTo(this.x + this.points[index].x
					,this.y + this.height - this.points[index].y) // flip y
			}
			else {
				context.lineTo(this.x + this.points[index].x
					,this.y + this.height - this.points[index].y) // flip y
			}
		}
		context.stroke();
	}
	else if(this.type === "filled_linegraph") // for those nice filled linegraphs
	{
		context.beginPath();
		// draw each line 
		for(var index = 0; index < this.points.length; index++)
		{
			if(index === 0)
			{
				context.moveTo(this.x + this.points[index].x
					,this.y + this.height - this.points[index].y) // flip y
			}
			else {
				context.lineTo(this.x + this.points[index].x
					,this.y + this.height - this.points[index].y) // flip y
			}
		}
		// draw a special downwards and then complete so we can fill!
		context.fillStyle = "#42f4d4"
		context.lineTo(this.x + this.width
			,this.y + this.height);
		context.lineTo(this.x
			,this.y + this.height);	
		context.closePath();
		context.fill();
		context.stroke();
	}
}

// points 
function Point (x, y)
{
	this.x = x;
	this.y = y;
}