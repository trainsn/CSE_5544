d3.csv("./data/casesByState.csv", drawBubble);

function drawBubble(error, casesByState){
	//	convert the dict data to hierarchy format 
	var hier_data = {"children": []};
	hier_data["children"]  = casesByState;
	// console.log(hier_data);

	var diameter = 380;

	var bubble = d3.pack(hier_data)
        .size([diameter, diameter])
        .padding(1.5);

   	var svg_bubble = d3.select("#bubble_svg")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

   	var nodes = d3.hierarchy(hier_data)
        .sum(function(d) { return d.cases; });
        
    var node = svg_bubble.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        }) // filter out the outer bubble
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", '#69b3a2');

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
        	// console.log(d)
            return d.data["state"];
        })
        .attr("font-size", function(d){
            return d.r/2.5;
        })
        .attr("fill", "white");
}