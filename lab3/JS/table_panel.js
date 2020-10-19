d3.csv("./data/casesByState.csv", drawTable);

function drawTable(error, casesByState){
	var columnNames = casesByState.columns;
	// Create a table
	tabulate(columnNames, casesByState);

	function tabulate(columnNames, data){
		var table = d3.select('#table_svg').append('table');
		var thead = table.append('thead');
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columnNames)
		  .enter()
		  .append('th')
		  .text(function (d) { 
		  	return d; 
		  });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		 	// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columnNames.map(function (columnName) {
		      return {
		      	key: columnName, 
		      	value: row[columnName]
		      };
		    });
		  })
		  .enter()
		  .append('td')
		  .text(function (d) { 
		  	return d.value; 
		  });
	}
	
}

