draw_barChart('California');

function draw_barChart(state_name){
	d3.csv("./data/casesByMonth.csv", drawBar);
	
	function drawBar(error, dataset){
		var casesByMonth;
		for (var i = 0; i < dataset.length; i++){
			if (dataset[i]["state"] == state_name){
				casesByMonth = dataset.slice(i, i+10);
				break;
			}
		}
		// console.log(casesByMonth);

		var margin = {top: 10, right: 20, bottom: 135, left: 40},
  		  width = 680 - margin.left - margin.right,
  		  height = 460 - margin.top - margin.bottom;

  		var x = d3.scaleBand()
  			.range([0, width])
  			.padding(0.065);
  		var y = d3.scaleLinear().range([height, 0]);

  		var bar_svg = d3.select("#bar_svg").append("svg")
  		    .attr("width", width + margin.left + margin.right)
  		    .attr("height", height + margin.top + margin.bottom)
  		  	.append("g")
  		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  		x.domain(dataset.map(function(d) { return d['month']; }));
  		var casesMax = 0;
  		for (const row of casesByMonth){
  			if (parseInt(row['cases']) > casesMax){
  				casesMax = parseInt(row['cases']);
  			}
  		}
  		y.domain([0, casesMax * 1.1]);

  		var xAxis = d3.axisBottom().scale(x);
  		var yAxis = d3.axisLeft().scale(y);

  		// append x axis
	  	bar_svg.append("g")
	  	    .attr("class", "x axis")
	  	    .attr("transform", "translate(0," + height + ")")
	  	    .call(xAxis)
	  	  .selectAll("text")
	  	    .style("text-anchor", "end")
	  	    .attr("dx", "-.8em")
	  	    .attr("dy", "-.6em")
	  	    .attr("transform", "rotate(-80)" );

	  	// append y axis
	  	bar_svg.append("g")
	       .attr("class", "y axis")
	       .call(yAxis)
	      .append("text");

	    // create rect bars
	  	bar_svg.selectAll("bar")
	       .data(casesByMonth)
	     .enter().append("rect")
	       .attr("id", function (d,i){ return d['month']; })
	       .style("fill", "steelblue")
	       .attr("x", function(d) { return x(d['month']); })
	       .attr("width", x.bandwidth())
	       .attr("y", function(d) { return y(d['cases']); })
	       .attr("height", function(d) { return height - y(d['cases']) });
	}
}	
	