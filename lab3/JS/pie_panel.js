draw_pieChart('California');

function draw_pieChart(state_name){
	d3.csv("./data/casesByMonth.csv", drawPie);
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct'];

	function drawPie(error, dataset){
		var casesByMonth;
		for (var i = 0; i < dataset.length; i++){
			if (dataset[i]["state"] == state_name){
				casesByMonth = dataset.slice(i, i+10);
				break;
			}
		}
		console.log(casesByMonth);

		var total_cases = 0;
		for (const row of casesByMonth){
			total_cases += parseInt(row['cases']);
		}
		var arcData = [];
		var currentAngle = 2 * Math.PI - (parseInt(casesByMonth[0]['cases']) + parseInt(casesByMonth[1]['cases'])) / total_cases;
		for (var i = 0; i < casesByMonth.length; i++){
			var cases = parseInt(casesByMonth[i]['cases']);
			if (cases > 0){
				arcData.push({"label": months[i], 
					"startAngle": currentAngle, 
					"endAngle": currentAngle + cases / total_cases * 2 * Math.PI});
				currentAngle += cases / total_cases * 2 * Math.PI;
			}
			if (i == 1)
				currentAngle -= 2 * Math.PI;
		}
		console.log(arcData);

		var margin = {top: 170, right: 20, bottom: 135, left: 350},
  		  width = 680 - margin.left - margin.right,
  		  height = 460 - margin.top - margin.bottom;
  		var color = d3.scaleOrdinal(d3.schemeCategory10);

  		var pie_svg = d3.select("#pie_svg").append("svg")
  		    .attr("width", width + margin.left + margin.right)
  		    .attr("height", height + margin.top + margin.bottom)
  		    .append("g")
  		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var radius = 150;
		var arc = d3.arc()
				.innerRadius(0)
				.outerRadius(radius);
		var outerArc = d3.arc()
               	.innerRadius(1.2 * radius)
                .outerRadius(1.2 * radius);
        var oArc = d3.arc()
                .innerRadius(1.0 * radius)
                .outerRadius(1.0 * radius);

		pie_svg.selectAll('path')
				.data(arcData)
				.enter()
				.append('path')
				.style("fill", function(d, i) { return color(i); })
				.attr('d', arc);

        //bind data, set legend position
		var legend = pie_svg.selectAll("g")
		        .data(arcData)
		        .enter()
		        .append("g")
		        .attr("transform", function (d, i) {
		            return "translate(" +  4 * 40 + "," + i * 25 + ")";
		        });

		//add legend's color rectangle
		legend.append("rect")
		        .attr("width", 20)
		        .attr("height", 20)
		        .style("fill", function (d, i) {
		            return color(i)
		        });

		//add legend word
		legend.append("text")
		        .attr("x", 24)
		        .attr("y", 9)
		        .style("fill", function (d, i) {
		            return color(i)
		        })
		        .attr("dy", ".35em")
		        .text(function (d, i) {
		            return d.label;
		        });
	}
}