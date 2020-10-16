
var brands = [], brand_ids = [];
var names = [];
var bar_svg;
var highlight_ids = []; 


/*
 Use bar chart to display the ranking of rating 
*/
function draw_barChart(dataset, brand_ids) {

  	var margin = {top: 10, right: 20, bottom: 135, left: 40},
  		  width = 680 - margin.left - margin.right,
  		  height = 460 - margin.top - margin.bottom;

  	var x = d3.scaleBand()
  			.range([0, width])
  			.padding(0.065);
  	var y = d3.scaleLinear().range([height, 0]);


  	bar_svg = d3.select("#bar_svg").append("svg")
  		    .attr("width", width + margin.left + margin.right)
  		    .attr("height", height + margin.top + margin.bottom)
  		  	.append("g")
  		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  	x.domain(dataset.map(function(d) { return d['name']; }));
  	y.domain([0, 100]);

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
       .attr("transform", "translate(0," + 6 + ")")
       .call(yAxis)
      .append("text");


    // create rect bars
  	bar_svg.selectAll("bar")
       .data(dataset)
     .enter().append("rect")
       .attr("id", function (d,i){ return d['name']; })
       .style("fill", "steelblue")
       .attr("x", function(d) { return x(d['name']); })
       .attr("width", x.bandwidth())
       .attr("y", function(d) { return y(d['rating']); })
       .attr("height", function(d) { return height - y(d['rating']) });


  }



/* update the selected manuf to highlight */
function update_barColors(selected_manuf) {
    for (const name of highlight_ids) {
    	d3.select('[id="'+name+'"]')
    	  .style("fill", "steelblue");
    }

  // get the names of selected products:
	highlight_ids = brand_ids[selected_manuf];

    for (const name of highlight_ids) {
    	d3.select('[id="'+name+'"]')
    	  .style("fill", "orange");
    }

}









