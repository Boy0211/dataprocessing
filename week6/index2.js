window.onload = function() {

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
};
