window.onload = function() {

  var margin = {top: 50, right:50, bottom:100, left:50};
  var width = 960 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;
  var duration = 800;

  var svg = d3.select("body")
      .append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom))
  .append("g")
      .attr("transform", "translate(" + (margin.left + margin.right) + ")");

  var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var color = d3.scaleOrdinal()
      .domain(["Male", "Female"])
      .range(["blue", "pink"])

  d3.json("data/data.json").then(function(data) {
    drawGroupedStackedBarChart(data);
    drawLineChart();

  });

  function drawGroupedStackedBarChart(data) {

      var id = [];
      var men = [];
      var women = [];
      for (i = 0; i < data.length; i++) {
        var value = data[i].Country
        var value1 = data[i].Male
        var value2 = data[i].Female
        id.push(value)
        men.push(value1)
        women.push(value2)
      };

      var x0 = d3.scaleBand()
          .range([0, width - margin.left - margin.right], .2);
      var x1 = d3.scaleBand()
          .padding(0.2);
      var y = d3.scaleLinear()
          .range([height, 0]);
      var xStack = d3.scaleBand()
          .domain(id)
          .range([0, width - margin.left - margin.right])
          .align(0.1)
          .padding(0.2);
      var yStack = d3.scaleLinear()
          .domain([0, (d3.max(women) + d3.max(men))])
          .range([height, 0])

      var xAxis = d3.axisBottom()
          .ticks(id)
          .scale(xStack)
      var yAxis = d3.axisLeft()
          .scale(yStack)

      // drawing the x-axis
      svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
          .call(xAxis)
        .selectAll("text")
          .attr("x", -8)
          .attr("y", 6)
          .attr("transform", "rotate(-40)")
          .style("text-anchor", "end");

      // drawing the y-axis
      svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis)

      svg.append("text")
        .attr("class", "label")
        .attr("x", 0-margin.left)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("dy", "1.5em")
        .style("text-anchor", "end")
        .text("Headcount population");

      var keys = d3.keys(data[0]).slice(1);
      var total = [];
      data.forEach(function(d) {
        total.push(d3.sum(keys,function(symbol) {return d[symbol];}))
      })

      x0.domain(data.map(function(d) {return d.Country}));

      x1.domain(keys)
          .range([0,x0.bandwidth()-10]);
      y.domain([0,d3.max(data, function(d) {return d3.max(keys, function(symbol) {return d[symbol]})})]);

      xStack.domain(data.map(function(d) {return d.Country}));
  		yStack.domain([0,d3.max(total)]);
      console.log(d3.max(total));

      var grouped = g.append("g")
    			.selectAll("g")
    			.data(d3.stack().keys(keys)(data))
    			.enter()
    			.append("g")
    			.attr("fill",function(d) {return color(d.key)});

      var rect = grouped.selectAll("rect")
    			.data(function(d) {return d;})
    			.enter()
    			.append("rect")
    			.attr("x",function(d) {return xStack(d.data.Country);})
    			.attr("y",function(d) {return yStack(d[1]);})
    			.attr("height",function(d) {return yStack(d[0]) - yStack(d[1]);})
    			.attr("width",xStack.bandwidth());

      d3.selectAll("input")
          .on("change", changed);


      function changed() {
          if (this.value ==="grouped") GroupedBar();
          else StackedBar();
      }

      function GroupedBar() {
  				rect
  				.transition()
  				.duration(duration)
  				.attr("width", x1.bandwidth())
  				.transition()
  				.duration(duration)
  				.attr("x",function(d,i) {
  					return x0(d.data.Country) + x1(this.parentNode.__data__.key);
  				})
  				.transition()
  				.duration(duration)
  				.attr("y",function(d) {return y(d[1]-d[0]);})
  				.attr("height",function(d) {return y(0)-y(d[1]-d[0]);});

          var yScaleGrouped = d3.scaleLinear()
              .domain([0, d3.max(women)])
              .range([height, 0])

          d3.select(".y-axis")
            .transition()
            .duration(duration)
            .call(d3.axisLeft(yScaleGrouped))
      };

      function StackedBar() {
    				rect
    				.transition()
    				.duration(duration)
    				.attr("y",function(d) {return yStack(d[1]-d[0]);})
    				.attr("height",function(d){return yStack(d[0])-yStack(d[1]);})
    				.transition()
    				.duration(duration)
    				.attr("y", function(d) {return yStack(d[1]);})
    				.transition()
    				.duration(duration)
    				.attr("x",function(d) {return xStack(d.data.Country);})
    				.attr("width",xStack.bandwidth());

            var yScaleGrouped = d3.scaleLinear()
                .domain([0, (d3.max(women) + d3.max(men))])
                .range([height, 0])

            d3.select(".y-axis")
              .transition()
              .duration(duration)
              .call(d3.axisLeft(yScaleGrouped))
    	};

  	// positions the group and gives the class legend
  	var legend = svg.selectAll(".legend")
  	.data(color.domain())
  	.enter()
  	.append("g")
  	.attr("class","legend")
  	.attr("transform",function(d,i) {
  		return "translate(0," + i * 15 + ")";
  	});

  	legend.append("path")
  	.style("fill",function(d) {return color(d);})
  	.attr("d", d3.symbol().type(d3.symbolSquare).size(120))
  	.attr("transform",function(d) {
  		return "translate (" + width/5 + "," + 10 +")";
  	})

  	legend.append("text")
  	.attr("x",width/5 + 15)
  	.attr("y",10)
  	.attr("dy",".30em")
  	.text(function(d) {return d;})

  	svg.append("text")
  	.attr("x",width/2 - 40)
  	.attr("y",20)
  	.attr("dy",".20em")
  	.attr("font-size",25)
  	.text("Population per Country")
  	.attr("class","title")
  };

  function drawLineChart() {
    var outerWidth = 960;
    var outerHeight = 550;
    var margin = { left: 80, top: 5, right: 70, bottom: 60 };
    var duration = 800

    var xColumn = "year";
    var yColumn = "population";
    var lineColumn = "country";

    var xAxisLabelText = "Time";
    var xAxisLabelOffset = 48;

    var yAxisLabelText = "Population";
    var yAxisLabelOffset = 60;

    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    var svg = d3.select("body").append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight);
    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxisG = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + innerHeight + ")")
    var xAxisLabel = xAxisG.append("text")
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
      .attr("class", "label")
      .text(xAxisLabelText);

    var yAxisG = g.append("g")
      .attr("class", "y axis");
    var yAxisLabel = yAxisG.append("text")
      .style("text-anchor", "middle")
      .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
      .attr("class", "label")
      .text(yAxisLabelText);

    var xScale = d3.scaleTime().range([0, innerWidth]);
    var yScale = d3.scaleLinear().range([innerHeight, 0]);

    // Use a modified SI formatter that uses "B" for Billion.
    var siFormat = d3.format("s");
    var customTickFormat = function (d){
      return siFormat(d).replace("G", "B");
    };

    var xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickSizeOuter(0);
    var yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(customTickFormat)
      .tickSizeOuter(0);

    var line = d3.line()
      .x(function(d) { return xScale(d[xColumn]); })
      .y(function(d) { return yScale(d[yColumn]); });

    function render(data){

      xScale.domain(d3.extent(data, function (d){ return d[xColumn]; }));
      yScale.domain([d3.min(data, function (d){ return d[yColumn]; }), d3.max(data, function (d){ return d[yColumn]; })]);

      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      var nested = d3.nest()
        .key(function (d){ return d[lineColumn]; })
        .entries(data);

      console.log(nested);

      var paths = g.selectAll(".chart-line")
          .data(nested)
          .enter()
        .append("path")
          .attr("class", "chart-line")
          .attr("d", function(d) { return line(d.values); })
          .exit().remove();
    }

    function type(d) {
      d.year = new Date(d.year);
      d.population = +d.population;
      return d;
    }

    d3.csv("data/data_final.csv", type).then(function(data) {
      render(data)
    });
  }
};
