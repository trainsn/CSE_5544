
var selected_manufs = 'Kelloggs'; // default brand

var brands = [], brand_ids = [];
var names = [];
var svg_bubble;



function unique(array) {
  return array.filter(function(a){
    return !this[a] ? this[a] = true : false;
  }, {});
}


/* load the csv file */
d3.csv("./cereal.csv", load_csvdata);

function load_csvdata(error, dataset) {

    // sort the dataset by rating in descending order
    dataset = dataset.slice().sort((a, b) => d3.descending(a['rating'], b['rating']))

    console.log(dataset);


	// normalize the data by cups unit
	for (var i = 0; i < dataset.length; i++) {
		var cups = dataset[i]['cups'];
		brands.push(dataset[i]['manufacturer']);
		names.push(dataset[i]['Name']);
		
		var keys = Object.keys(dataset[i]).slice(3,-2);
		for (var j = 0; j < keys.length; j++) {
			var k = keys[j];
			dataset[i][k] = (dataset[i][k] / cups).toFixed(2);	
		}
	}

    // build a dict to store the names of each manufacturer
    brands = unique(brands);
    brand_ids = {};
    brands.map(function(brand) { brand_ids[brand] = []; })
   

    for (var r = 0; r < dataset.length; r++) {
     	var manuf = dataset[r]['manufacturer']
     	brand_ids[manuf].push(dataset[r]['name']);
    }

    console.log(brand_ids);

    /* 
        Bubble chart: size of circle represents the 
        number of products in the market 
    */

    // convert the dict data to hierarchy format
    var hier_data = {"children": []};
    for (const [key, value] of Object.entries(brand_ids)) {
    	hier_data["children"].push({"BrandName":key, "Count":value.length});
    }


	var diameter = 380;
	var color = d3.scaleOrdinal(d3.schemeCategory10);

    var bubble = d3.pack(hier_data)
        .size([diameter, diameter])
        .padding(1.5);

    svg_bubble = d3.select("#bubble_svg")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");


    var nodes = d3.hierarchy(hier_data)
        .sum(function(d) { return d.Count; });

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

    node.append("title")
        .text(function(d) {
            return d.Name + ": " + d.Count;
        });
 

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d, i) { return color(i); })
        .on("click", function(d) {
        	// store the selected manufacturer name
        	selected_manufs = d.data['BrandName'];
        	// change the highlighting product names
        	update_manuf(dataset, brand_ids);
    	});

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
        	// console.log(d)
            return d.data["BrandName"].substring(0, d.r / 3);
        })
        .attr("font-size", function(d){
            return d.r/4;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Count;
        })
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");


    /*
        draw bar chart and heat map
    */
    draw_barChart(dataset, brand_ids);
    draw_heatmap(dataset, brand_ids);

}


function update_manuf(dataset, brand_ids) {
    /* update the selected manufacturer to highlight 
       bars in the bar chart */
    update_barColors(selected_manufs);
    /* redraw the heatmap */
    update_heatmap(dataset, brand_ids); 
}





















 


