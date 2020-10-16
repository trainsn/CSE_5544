
var brands = [], brand_ids = [];
var names = [];
var heatmap_svg;



function normalize(list) { 
	var newList = [], norm_list = [];
	list.map(function(elem) { newList.push(parseFloat(elem)) }); 
	var mini = d3.min(newList), maxi = d3.max(newList);
	newList.map(function(elem) { norm_list.push((elem - mini) / (maxi - mini)); });   
	return norm_list; 
}


function draw_heatmap(dataset, brand_ids) {

    /* normalize the values of cereal attributes */
    var attributes = Object.keys(dataset[0]).slice(3,-2);
    var values = {}; 
    values['name'] = [];
    attributes.map(function(att) {values[att] = []; });
 
 	// store into heatmap dataset for the selected manufacturer
	brand_ids[selected_manufs].map(function(name) { 
    	values['name'].push(name);
    });
    for (const att of attributes) {
	    brand_ids[selected_manufs].map(function(name) { 
	    	for (var i = 0; i < dataset.length; i++) {
	    		var rowdata = dataset[i];
		    	if (rowdata['name'] == name)
		    		values[att].push(rowdata[att]); 
	    	}
	    });
	}

    var heatmap_data = []; 
    for (const name of values['name']) {
    	for (const att of attributes) { 
    		var name_id = values['name'].indexOf(name);
    		heatmap_data.push({'name':name, 'attribute':att, 'value':normalize(values[att])[name_id] });
    	}
    }


    /*
		build up a heatmap to show the differences among products
		of a selected manufacturer
    */
	var margin = {top: 50, right: 30, bottom: 30, left: 150},
	    width = 750 - margin.left - margin.right,
	    height = 450 - margin.top - margin.bottom


	var x = d3.scaleBand()
			.range([0, width])
			.domain(attributes)
			.padding(0.01);
	var y = d3.scaleBand()
			.range([height, 0])
			.domain(values['name'])
			.padding(0.01);


	heatmap_svg = d3.select("#heatmap_svg").append("svg")
	  				.attr("width", width + margin.left + margin.right)
	  				.attr("height", height + margin.top + margin.bottom)
					.append("g")
	  				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var xAxis = d3.axisBottom(x).tickValues(attributes);
	var yAxis = d3.axisLeft(y).tickValues(values['name']);

	// append x axis
 	heatmap_svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	// append y axis
  	heatmap_svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(y));


	// build color scale
	var myColor = d3.scaleLinear()
  		.range(["#ebf5f3", "#69b3a2"])
  		.domain([0, 1])


	heatmap_svg.selectAll()
	    .data(heatmap_data)
	    .enter().append('g')
	    .append("rect")
	    .attr("x", function(d) { return x(d['attribute']) })
	    .attr("y", function(d) { return y(d['name']) })
	    .attr("width", x.bandwidth())
	    .attr("height", y.bandwidth())
	    .style("fill", function(d) { return myColor(d['value'])} )

 
}



/* update the selected manuf to draw heatmap */
function update_heatmap(dataset, brand_ids) {
    d3.select('#heatmap_svg').select("svg").remove();
    draw_heatmap(dataset, brand_ids); // redraw heatmap
}














