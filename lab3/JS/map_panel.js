d3.json("./data/usa_mainland.json", drawUSA);
var map_svg;
var paths;

function drawUSA(error, states) {
	var width_map = 700;
	var height_map = 700;

	var projection = d3.geoEquirectangular()
		.fitExtent([[0,0], [width_map, height_map]], states);
	
	var geoGenerator = d3.geoPath()
		.projection(projection);

	map_svg = d3.select("#map_svg")
					.append("svg")
					.attr("width", width_map)
					.attr("height", height_map);

	paths = map_svg
		.selectAll("path")
		.data(states.features)
		.enter()
		.append("path")
		.attr("d", geoGenerator)
		.style("fill", "#ddd")
		.style("stroke", "#aaa");

	var texts = map_svg
		.selectAll("text")
		.data(states.features)
		.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "middle")
		.attr("opacity", 0.5)
		.text(function(d) {
			return d.properties.STUSPS10;
		})
		.attr("transform", function(d) {
			var center = geoGenerator.centroid(d);
			return "translate (" + center + ")";
		});
}