
d3.csv("iris.csv", function(error, flowers) {

	var size = 140,
		width = 960,
		n = 4,
	    padding = 10;

	var x = d3.scaleLinear()
	    .range([padding / 2, size - padding / 2]);

	var y = d3.scaleLinear()
	    .range([size - padding / 2, padding / 2]);

	var xAxis = d3.axisBottom()
	    .scale(x)
	    .ticks(5)
	    .tickSize(size * n);

	var yAxis = d3.axisRight()
	    .scale(y)
	    .ticks(5)
	    .tickSize(size * n);

  xAxis.tickSize(size * n);
  yAxis.tickSize(size * n);

  var domainByTrait = {},
      traits = ["sepal length", "sepal width", "petal length", "petal width"],
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(flowers, function(d) { return d[trait]; });
  });

  var brush = d3.brush()
      .on("start", brushstart)
      .on("brush", brush)
      .on("end", brushend)
      .extent([[0,0],[size, size]]);

  var svg = d3.select("body").append("svg")
      .attr("width", 1280)
      .attr("height", 800)
    .append("g")
    .attr("transform", "translate(359.5,69.5)");

  // Legend.
  var legend = svg.selectAll("g.legend")
      .data(["setosa", "versicolor", "virginica"])
    .enter().append("svg:g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 600) + ")"; });

  legend.append("svg:circle")
      .attr("class", String)
      .attr("r", 3);

  legend.append("svg:text")
      .attr("x", 12)
      .attr("dy", ".31em")
      .text(function(d) { return "Iris " + d; });

  // X-axis.    
  svg.selectAll(".x.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

  // Y-axis.
  svg.selectAll(".y.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { 
      	return "translate(0," + i * size + ")"; 
      })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) {  
      	return "translate(" + d.i * size + "," + d.j * size + ")"; 
      })
      .each(plot);

  // add title for the diagonal entries
  cell.filter(function(d) { 
  	return d.i === d.j; })
  	  .append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  cell.call(brush);

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    // Plot frame.
    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    // Plot dots.
    cell.selectAll("circle")
        .data(flowers)
      .enter().append("circle")
      .attr("class", function(d) { return d.species; })
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 3);
  }

  var brushCell;
 
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null); // clear brush
      brushCell = this;
    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);
    }
  }

  // Highlight the selected circles.
  function brush(p) {
    var e = d3.brushSelection(this);
    svg.selectAll("circle").classed("hidden", function(d) {
      if (!e)
        return false;
      return  (x(d[p.x]) < e[0][0] || x(d[p.x]) > e[1][0] 
        || y(d[p.y]) < e[0][1] || y(d[p.y]) > e[1][1]);
    });
  }
 
  function brushend() { 
    var e = d3.brushSelection(this);
    if (e === null) 
      svg.selectAll(".hidden").classed("hidden", false);
  }
});

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}