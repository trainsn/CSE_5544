var margin = {top: 80, right: 0, bottom: 10, left: 80},
    width = 720,
    height = 720;

var x = d3.scaleBand().range([0, width]),
    z = d3.scaleLinear().domain([0, 4]).clamp(true),
    c = d3.scaleOrdinal(d3.schemeCategory10)
          .domain(d3.range(10));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("miserables.json", function(miserables) {
  var matrix = [],
      nodes = miserables.nodes,
      n = nodes.length;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });

  // Convert links to matrix; count character occurrences.
  miserables.links.forEach(function(link) {
    matrix[link.source][link.target].z += link.value;
    matrix[link.target][link.source].z += link.value;
    matrix[link.source][link.source].z += link.value;
    matrix[link.target][link.target].z += link.value;
    nodes[link.source].count += link.value;
    nodes[link.target].count += link.value;
  });

  // var orderByName = d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); })
  var orderByName = d3.range(n).sort(function(a, b){
    diff = nodes[b].group - nodes[a].group
    return diff;
  })

  x.domain(orderByName);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return nodes[i].name; });

  var column = svg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -width);

  column.append("text")
      .attr("x", 6)
      .attr("y", x.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; });

  

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.bandwidth()) 
        .attr("height", x.bandwidth())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; });
  }

  function mouseover() {

  }

  function mouseout() {
 
  }

});