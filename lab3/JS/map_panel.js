import { abbrState } from "./stateToAbbr.js"
d3.csv("./data/casesByState.csv", drawMapCircle);

function drawMapCircle(error, casesByState){
	d3.json("./data/usa_mainland.json", drawUSA);
	var map_svg;
	var paths;

	function drawUSA(error, states) {
		var width_map = 900;
		var height_map = 900;

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

		function get_radius(state){
			var num = 0;
			for (const row of casesByState){
				if (row['state'] == state)
					num = row['cases'];
			}
			return num / 20000;
		}

		// draw circle on US map
		// (at each center of the state area)
		map_svg.selectAll('circle')
	    	.data(states.features).enter()
		    .append('circle')
		    .attr('cx', function(d) {
		    	var center = geoGenerator.centroid(d); 
		        return center[0];
		    })
		    .attr('cy', function(d) {
		    	var center = geoGenerator.centroid(d); 
		        return center[1];
		    })
		    .attr('r', function(d) {
		    	var state = d.properties.STUSPS10;
		    	state = abbrState(state, 'name');
		    	// console.log(state);
		        return get_radius(state);
		    })
		    .attr('fill', 'steelblue')
		    .attr('opacity', 0.55);
	}
}

