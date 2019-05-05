/*
	A table that contains data.
 */
function Table(title, column_names)
{
	this.title = title;
	this.columns = [];
	for (var index = 0; index < column_names.length; index++)
	{
		this.columns.push(new Table_column(column_names[index]));
	}
}
Table.prototype.get_height = function()
{
	return this.columns[0].cells.length;
}

Table.prototype.add_row = function(row)
{
	for(var index = 0; index < this.columns.length; index++)
	{
		var cell = "";
		if(row) cell = row[index];
		this.columns[index].add_cell(cell);
	}
}

// remove the first and add the last one!
Table.prototype.queue_row = function(row)
{		
	for(var index = 0; index < this.columns.length; index++)
	{
		var cell = "";
		if(row) cell = row[index];
		// remove last 
		this.columns[index].cells.shift();
		// add first
		this.columns[index].cells.push(cell);
	}
}

// deletes all rows from all columns 
Table.prototype.flush_rows = function()
{
	for(var index = 0; index < this.columns.length; index++)
	{
		this.columns[index].cells = [];
	}
}

Table.prototype.set_cell = function(column, row, cell)
{
	this.columns[column].cells[row] = cell;
}

Table.prototype.sort_ascending = function(column_index)
{
	if (!(column_index >= 0 && column_index < this.columns.length)) return;
	// get the data into a palatable form
	var rows = [];
	for(var y = 0; y < this.columns[column_index].cells.length; y++)
	{
		var row = [];
		for(var x = 0; x < this.columns.length; x++)
		{
			row.push(this.columns[x].cells[y]);
		}
		rows.push(row);	
	}
	// sort 
	rows.sort(function(a,b) {return a[column_index] - b[column_index]});
	// refeed the data 
	this.flush_rows();
	for(var index = 0; index < rows.length; index++)
	{
		this.add_row(rows[index]);
	}
	return rows;
}

function Table_column(title)
{
	this.title = title;
	this.cells = [];
}

Table_column.prototype.add_cell = function(cell)
{
	this.cells.push(cell);
}

