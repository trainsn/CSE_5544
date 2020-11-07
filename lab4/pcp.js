var species = ["setosa", "versicolor", "virginica"],
    traits = ["sepal length", "petal length", "sepal width", "petal width"];

var m = [80, 160, 200, 160],
    w = 1280 - m[1] - m[3],
    h = 800 - m[0] - m[2];

var x = d3.scalePoint().domain(traits).range([0, w]),
    y = {};

var line = d3.line(),
    axis = d3.axisLeft(x),foreground;

var svg = d3.select("body").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var colorMap = ["red", "green", "blue"];

function colorBySpecies(d){
  var index = species.indexOf(d.species);
  return colorMap[index];
}

d3.csv("iris.csv", function(flowers) {

  traits.forEach(function(d) {
    flowers.forEach(function(p) { p[d] = +p[d]; });

    y[d] = d3.scaleLinear()
        .domain(d3.extent(flowers, function(p) { return p[d]; }))
        .range([h, 0]);

    y[d].brush = d3.brushY() 
        .extent([[-8, 16], [8, h]])
        .on("brush", brush);
 });

  // Add foreground lines.
  foreground = svg.append("svg:g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(flowers)
    .enter().append("svg:path")
      .attr("d", path)
      .style("stroke", function(d){
        return colorBySpecies(d);
      });

  // Add a group element for each trait.
  var g = svg.selectAll(".trait")
      .data(traits)
    .enter().append("svg:g")
      .attr("class", "trait")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  // Add an axis and title.
  g.append("svg:g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); });
    
  g.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String); 

  // Add a brush for each axis.
  g.append("svg:g")
      .attr("class", "brush")
      .each(function(d) { 
        console.log(y[d]);
        d3.select(this).call(y[d].brush); }); 
});

// Returns the path for a given data point.
function path(d) {
  return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {

}