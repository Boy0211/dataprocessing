window.onload = function() {

  // functions used to determine the min and max of an array of dictionaries
  // All credits go to
  // https://codeburst.io/javascript-finding-minimum-and-maximum-values-in-an-array-of-objects-329c5c7e22a2
  // the function is adjusted that way, that it is usefull for this assignment
  function findMinMax(arr) {
    let min = arr[0].datapoint, max = arr[0].datapoint;

    for (let i = 1, len=arr.length; i < len; i++) {
      let v = arr[i].datapoint;
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }
    return [min, max];
  };

  // variables with margins, width and height
  var margin = {top: 50, right:50, bottom:50, left:50};
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // setup fill color
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var cValue = function(d) {return d.country}

  // creating a svg element
  // all Credits go to the documentation of D3 (https://github.com/d3/d3/wiki)
  var svg = d3.select("body")
      .append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom))
  .append("g")
      .attr("transform", "translate(" + (margin.left + margin.right) + ")");

  // 2 API's which gather data from the OECD
  var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var requests = [d3.json(womenInScience), d3.json(consConf)];

  Promise.all(requests).then(function(response) {

    var dataSet0 = (transformResponse0(response[0]));
    var dataSet1 = (transformResponse1(response[1]));

    minmax_dataSet0 = findMinMax(dataSet0);
    minmax_dataSet1 = findMinMax(dataSet1);

    // creating the scale of the plot
    var xScale = d3.scaleLinear()
        .range([0, width - 5])
        .domain([minmax_dataSet0[0] * 0.98, minmax_dataSet0[1] * 1.02])
    var yScale = d3.scaleLinear()
        .range([height, margin.top])
        .domain([minmax_dataSet1[0] * 0.999, minmax_dataSet1[1] * 1.001])

    // creating the axis of the plot
    var xAxis = d3.axisBottom()
        .scale(xScale)
    var yAxis = d3.axisLeft()
        .scale(yScale)

    // drawing the x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "end")
        .text("Women researchers as a percentage of total researchers (headcount)");

    // drawing the y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis)

    svg.append("text")
      .attr("class", "label")
      .attr("x", 0-margin.left)
      .attr("y", -80)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1.5em")
      .style("text-anchor", "end")
      .text("Consumer confidence");


    // Rewriting the datastructure to make it usefull.
    var scatterpoints = []
    var counter = 0
    var listOfYears = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];

    // from th efirst dataset; the name of the country, year and x-value are gathered
    for (var i = 0; i < dataSet0.length; i++) {
      if (listOfYears[counter % 9] == dataSet0[i]["time"]) {
        var year = listOfYears[counter % 9];
        var country = dataSet0[i]["country"]
        var xValue = dataSet0[i]["datapoint"]
        var xInfo = dataSet0[i]["MSTI Variables"]
      }
      else {
        var year = listOfYears[counter % 9];
        var country = dataSet0[i - 1]["country"];
        var xValue = "00000";
        var xInfo = dataSet0[i - 1]["MSTI Variables"];
        i = i - 1;
      };
      counter++;
      scatterpoints.push({
          year: year,
          country: country,
          xValue: xValue,
          yValue: "NaN",
          xInfo: xInfo,
          yInfo: "NaN"
      });
    };

    // from the second dataset; the y-value is gathered.
    listOfCountrys =["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"]
    while(dataSet1.length > 0) {
      for(var j = 0; j < scatterpoints.length; j++) {

        if (dataSet1[0]["Country"] == scatterpoints[j]["country"] && dataSet1[0]["time"] == scatterpoints[j]["year"]) {
          scatterpoints[j].yValue = dataSet1[0]["datapoint"];
          scatterpoints[j].yInfo = dataSet1[0]["Indicator"];
          dataSet1.shift();
          break;
        };
      };
    };
    console.log(scatterpoints);

    // drawing the dots
    var dot = svg.selectAll(".dot")
        .data(scatterpoints)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) {
          return xScale(d["xValue"]);
        })
        .attr("cy", function(d) {
          return yScale(d["yValue"]);
        })
        .attr("r", 4)
        .style("fill", function(d) { return color(cValue(d));})

    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
        .attr("x", width - 17)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", color);

      legend.append("text")
        .attr("x", width - 21)
        .attr('dy', '.78em')
        .attr("height", 12)
        .text(function(d) {return d})
        .style("text-anchor", "end")
        .style("font-size", "12px")


      // click on function
      // help from https://bl.ocks.org/floofydugong/9c94ab01d8c3ed8ea3821d4a7e119b07
      legend.on("click", function(type) {
          // dim all of the icons in legend
          d3.selectAll(".legend")
              .style("opacity", 0.1);
          // make the one selected be un-dimmed
          d3.select(this)
              .style("opacity", 1);
          // select all dots and apply 0 opacity (hide)
          d3.selectAll(".dot")
              .style("opacity", 0.1)
          // .transition()
          // .duration(500)
          // filter out the ones we want to show and apply properties
              .filter(function(d) {
                return d["country"] == type;
              })
                .style("opacity", 1)
                .attr("r", 6)
          });

  // return an error, when the API doesn't return data.
  }).catch(function(e){
      throw(e);
  });

};
