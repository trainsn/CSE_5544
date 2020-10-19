import { draw_barChart } from "./bar_panel.js"
import { draw_pieChart } from "./pie_panel.js"
d3.csv("./data/casesByState.csv", drawTable);

function drawTable(error, casesByState){
	var columnNames = casesByState.columns;
	// Create a table
	tabulate(columnNames, casesByState);

	var selectedState = 'Ohio';
	draw_barChart(selectedState);
	draw_pieChart(selectedState);

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
		  .append('tr')
		  .on("click", function(d){
		  	selectedState = d.state;
		  	update_barChart();
		  	update_pieChart();
		  });

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

		function update_barChart(){
			d3.select("#bar_svg").select("svg").remove();
			draw_barChart(selectedState);
		}

		function update_pieChart(){
			d3.select("#pie_svg").select("svg").remove();
			draw_pieChart(selectedState);
		}
	}
	
}

