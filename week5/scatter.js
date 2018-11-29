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
  var cValue = function(d) { return d.country;};
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // creating a svg element
  // all Credits go to the documentation of D3 (https://github.com/d3/d3/wiki)
  var svg = d3.select("body")
      .append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom))
  .append("g")
      .attr("transform", "translate(" + (margin.left + margin.right) + ")");

  // 2 API's which gather data from the OECD
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var requests = [d3.json(womenInScience), d3.json(consConf)];

  Promise.all(requests).then(function(response) {

    var dataSet0 = (transformResponse0(response[0]));
    var dataSet1 = (transformResponse1(response[1]));
    scatterpoints = []
    console.log(dataSet0, dataSet1)

    minmax_dataSet0 = findMinMax(dataSet0);
    minmax_dataSet1 = findMinMax(dataSet1);

    // creating the scale of the plot
    var xScale = d3.scaleLinear()
        .range([0, width - margin.right])
        .domain([minmax_dataSet0[0] * 0.98, minmax_dataSet0[1] * 1.02])
    var yScale = d3.scaleLinear()
        .range([height, margin.top])
        .domain([minmax_dataSet1[0] * 0.999, minmax_dataSet1[1] * 1.001])

    // creating the axis of the plot
    var xAxis = d3.axisBottom()
        .scale(xScale)
    var yAxis = d3.axisLeft()
        .scale(yScale)

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);



    var scatterpoints = []
    var counter = 0
    var listOfYears = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
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

    svg.selectAll("point")
        .data(scatterpoints)
      .enter().append("circle")
        .attr("class", "datapoint")
        .attr("cx", function(d) {
          return xScale(d["xValue"]);
        })
        .attr("cy", function(d) {
          return yScale(d["yValue"]);
        })
        .attr("r", 4)
        .style("fill", function(d) { return color(cValue(d));})


  }).catch(function(e){
      throw(e);
  });

};
