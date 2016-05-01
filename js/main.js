/* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).
		The variable "data" is accessible to you, as you read it in from data.js
*/
$(function() {
	// Read in prepped_data file
	d3.csv('data/AccidentData.csv', function(error, allData){
		//sp_limit = x, number of people involved in crash = persons color change : death percentage
		// Variables that should be accesible within the namespace
		console.log(allData);
		//x and y min and max
		var xMin = d3.min(allData, function(d){ return d.SP_LIMIT});
		var xMax = d3.max(allData, function(d) {return d.SP_LIMIT});
		var currentData;
		var yMax = d3.max(allData, function(d){return +d.PERSONS})
		var	yMin =d3.min(allData, function(d){return d.PERSONS});



		// Margin: how much space to put in the SVG for axes/titles
		var margin = {
			left:70,
			bottom:100,
			top:50,
			right:50,
		};


		// Height/width of the drawing area for data symbols
		// size for each grid for heatmap
		var height = 600 - margin.bottom - margin.top;
		var width = 1000 - margin.left - margin.right;
		var gridSizeWidth = width / xMax; //70 is the max speed limit
		var gridSizeHeight = height / yMax;
		var colorDiff = 10; // 10 different colors representing 10% change
		var colorScaleWidth = width / colorDiff;
		var colors = ['#63bcf2', '#fcdede', '#f79d9e', '#f25c5c', '#ff6e5b', '#d84d3b', '#a93b2d', '#78291e', '#4f1912', '#3a100a']
	 	


	 	// Select SVG to work with, setting width and height (the vis <div> is defined in the index.html file)
		var svg = d3.select('#vis')
			.append('svg')
			.attr('height', 600)
			.attr('width', 1000);

		// Append a 'g' element in which to place the rects, 
		var g = svg.append('g')
				.attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')');

		// Append an xaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
		var xAxisLabel = svg.append('g')
							.attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
							.attr('class', 'axis');

		// Append a yaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
		var yAxisLabel = svg.append('g')
							.attr('class', 'axis')
							.attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

		// Append text to label the y axis (don't specify the text yet)
		var xAxisText = svg.append('text')
						 .attr('transform', 'translate(' + (margin.left + width/2) + ',' + (height + margin.top + 40) + ')')
						 .attr('class', 'title');

		// Append text to label the y axis (don't specify the text yet)
		var yAxisText = svg.append('text')
						 .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + height/2) + ') rotate(-90)')
						 .attr('class', 'title');


		// Track whether the viewer is looking at drunk or non-drunk
		var drunkness = 0; // whether there's drunk  in the car or not.
		var yVarType = 'PERSONS' // VE_TOTAL = vehical involved


		// Write a function for setting scales.
		var setScales = function(data) {

			// Define an ordinal xScale using rangeBands
			xScale  = d3.scale.linear().range([0, width]).domain([0, xMax]);

			// Define the yScale: remember to draw from top to bottom!
			yScale = d3.scale.linear().range([height, 0]).domain([yMax, 0]); //??
			console.log("yMax " + yMax);
		}

		// Function for setting axes
		var setAxes = function() {
			// Define x axis using d3.svg.axis(), assigning the scale as the xScale
			var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient('bottom');

			// Define y axis using d3.svg.axis(), assigning the scale as the yScale
			var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient('left');

			// Call xAxis
			xAxisLabel.transition().duration(1500).call(xAxis);

			// Call yAxis
			yAxisLabel.transition().duration(1500).call(yAxis);

			// Update labels
			yAxisText.text(yVarType);
			xAxisText.text('SpeedLimit');
		}

		// Write a function to filter down the data to the current sex and type
		var filterData = function() {
			currentData = allData.filter(function(d) {
				if(drunkness == 0) {
					return d.DRUNK_DR == 0
				} else {
					return d.DRUNK_DR > 0
				}
				return 0;
			})
			/*
			// combine repetitive data into one average data
			var newData = [[23,[13,[5,7]]]];
			console.log(newData.hasOwnProperty(23));
			/*currentData.forEach(d) {
				if(d.SPEEDLIMIT)
			}*/

		
		}

		var yVarData = function(datum) {
			if(yVarType =='PERSONS') {
				return datum.PERSONS;
			} else {
				return datum.VE_TOTAL;
			}
			return ;
		}
		// Store the data-join in a function: make sure to set the scales and update the axes in your function.
		var draw = function(data) {

			if(yVarType == 'PERSONS') {
				yMax = d3.max(allData, function(d){return +d.PERSONS})
				yMin =d3.min(allData, function(d){return d.PERSONS});
			} else {
				yMax = d3.max(allData, function(d){return d.VE_TOTAL});
				yMin =d3.min(allData, function(d){return d.VE_TOTAL});
			}

			//reset gridSize Height based on the size of range of y
			gridSizeHeight = height / yMax;

			// Set scales
			setScales(data)

			// Set axes
			setAxes()

			//set colorScale that will be shown on the bottom
			var colorScale = d3.scale.quantile()
						.domain([0, 1])
						.range(colors);

			// Select all rects and bind data
			var bars = g.selectAll('rect').data(data);
			var yVarExPlainText;
			// Use the .enter() method to get your entering elements, and assign initial positions
			bars.enter().append('rect')
				.attr('x', function(d) {return (d.SP_LIMIT - 1) * gridSizeWidth; })
				.attr('y', function(d) { 
					return (yVarData(d) - 1) * gridSizeHeight;
				})
				.attr('rx', 4)
				.attr('ry', 4)
				.attr('height', yScale(1))
				.attr('width', gridSizeWidth)
				.attr('class', 'deathRate')
				.attr('title', function(d) {
					var yVarExPlainText;
					if(yVarType =='PERSONS') {
						yVarExPlainText = '# of people involved in accident: '
					} else {
						yVarExPlainText = '# of vehicle involved in accident: '
					}
					return "Speed Limit: " + d.SP_LIMIT 
						+ '\n' + yVarExPlainText + yVarData(d)
						+ '\n # of fatal: ' + d.FATALS;
				})
				.style('fill', colors[0]);

			// Use the .exit() and .remove() methods to remove elements that are no longer in the data
			bars.exit().remove();

			// Transition properties of the update selection
			
			bars.transition()
				.duration(500)
				.style('fill', function(d){  return colorScale(d.FATALS / d.PERSONS);} )
				.delay(function(d,i){return i*1})// motion
				.attr('x', function(d) { return xScale(d.SP_LIMIT)}) 
				.attr('y', function(d){
					var yPos;
					if(yVarType =='PERSONS') {
						yPos = d.PERSONS;
					} else {
						yPos = d.VE_TOTAL;
					}
					return yScale(yPos);
				})
				.attr('height', yScale(1))
				.attr('width', xScale(5))
				.attr('title', function(d) {return d.SP_LIMIT});

	          bars.select("title").text(function(d) { return d.FATALS / d.PERSONS; });
	          
	          bars.exit().remove();
			
			//show corlor scale chart 
			var colorScaleChart = svg.selectAll(".colorScaleChart")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

	          colorScaleChart.enter().append("g")
	              .attr("class", "colorScaleChart");

	          colorScaleChart.append("rect")
	            .attr("x", function(d, i) { return colorScaleWidth * i; })
	            .attr("y", 580)
	            .attr("width", colorScaleWidth)
	            .attr("height", gridSizeHeight / 2)
	            .style("fill", function(d, i) { return colors[i]; });

	          colorScaleChart.append("text")
	            .attr("class", "chart")
	            .text(function(d) { return "≥ " + Math.round(d * 100) / 100; })
	            .attr("x", function(d, i) { return colorScaleWidth * i; })
	            .attr("y", 580 + gridSizeHeight);

	          colorScaleChart.exit().remove();


		}
		// Assign a change event to input elements to set the sex/type values, then filter and update the data
		$('input').on('change', function() {
			// Get value, determine if it is the sex or type controller
			var val = $(this).val();
			if(val == 'VE_TOTAL') { yVarType = val;}
			else if(val == 'PERSONS') { yVarType = val;}
			else {drunkness = val;}
			console.log(yVarType);
			// Filter data, update chart
			filterData();
			draw(currentData);
		});

		// Filter data to the current settings then draw
		filterData()
		draw(currentData)

		/* Using jQuery, select all circles and apply a tooltip
		If you want to use bootstrap, here's a hint:
		http://stackoverflow.com/questions/14697232/how-do-i-show-a-bootstrap-tooltip-with-an-svg-object
		*/
		$('rect').tooltip({
			'container': 'body',
			'placement': 'bottom'
		});

	});
});