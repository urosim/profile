var GT_username = "ngupta327"

var width = 1200,
    height = 570;

var projection = d3.geoMercator()
    .center([0, 5 ])
    .scale(150)
    .rotate([-180,0]);

var svg = d3.select("#map_chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g");

svg.append("text")
    .attr("x", width)
    .attr("y", height)
    .attr("dx", "-1em")
    .attr("dy", "-1em")
    .attr("text-anchor", "end")
    .text(GT_username);

svg.append("text")
  .attr("x", width)
  .attr("y", 30)
  .attr("text-anchor", "end")
  .style("font-size", "16px")
  .text("Earthquake Frequency");


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden")

// load csv and then chart
d3.csv("state-earthquakes.csv").then(function (data) {
  chart(data)
})

function chart(csv) {

  var dataTime = []
  var years = csv.columns.slice(2)
  years.pop()
  years.map(d => {
    dataTime.push(parseInt(d))
  })

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1)
    .width(300)
    .tickFormat(d3.format("d"))
    .tickValues(dataTime)
    .on('onchange', val => {
      loadChart(csv, val)
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  loadChart(csv, d3.min(dataTime))
}

function loadChart(data, year) {

  d3.selectAll(".lineLegend").remove()
  d3.selectAll("path.map").remove()

  var yearByData = []
  data.map((item, index) => {
    if(!yearByData.includes(item[year])) yearByData.push(item[year])
  })
  yearByData.sort((a, b) => {return parseInt(a) - parseInt(b)})
  if (yearByData[0] == 0) yearByData = yearByData.slice(1)
  var maxValue = d3.max(yearByData)

  var colorSet = interpolateColors("rgb(249, 243, 238)", "rgb(149, 33, 2)", yearByData.length)
  var params = []
  yearByData.map((a, i) => params.push([a, i]))
  var legend_keys = getRandom(params, 9).sort((a, b) => {return a[0] - b[0]})
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width - 100) + "," + (i * 25 + 40) + ")";
    });

  lineLegend.append("text").text(function (d, i) { return d[0]; })
    .attr("transform", "translate(30, 14)");

  lineLegend.append("rect")
    .attr("fill", function (d, i) { return "rgb(" + colorSet[d[1]][0] + "," + colorSet[d[1]][1] + "," + colorSet[d[1]][2] + ")" })
    .attr("width", 20).attr("height", 20);

  // load and display the World
  d3.json("states-10m.json").then(function(topology) {
      g.selectAll("path")
         .data(topojson.feature(topology, topology.objects.states)
             .features)
         .enter().append("path")
         .attr("class", function(d){return d.properties.name + " map"})
         .attr("d", path)
         .attr("transform", "scale(5) translate(-580, -105)")
         .style('fill', function(d){ return getColorByState(data, yearByData, d.properties.name, year, colorSet)})
         .style('stroke-width', 0.2)
         .style('stroke', '#000000')
         .on("mouseover", function(d) {
             div.style("visibility", "visible");
             div.html("<label>State: " + d.properties.name + "</label><br/>" +
                       "<label>Region: " + getRegionAndCount(data, d.properties.name, year)[1] + "</label><br/>" +
                       "<label>Years: " + year + "</label><br/>" +
                       "<label>Earthquake: " + getRegionAndCount(data, d.properties.name, year)[0] + "</label>")
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY) + "px");
         })
         .on("mouseout", function() {
           div.style("visibility", "hidden");
         })
      g.select("path.Alaska")
        .attr("transform", "scale(1) translate(-320, 390)")
       g.select("path.Hawaii")
         .attr("transform", "scale(5) translate(-470, -125)")
  });
}

function getColorByState(data, yearByData, state, year, colorSet) {
  let color = "#EFEFEF"
  data.some((item, index) => {
    if (item[year] != 0 && item.States === state) {
      let i = yearByData.indexOf(item[year])
      color = "rgb(" + colorSet[i][0] + "," + colorSet[i][1] + "," + colorSet[i][2] + ")"
      return
    }
  })
  return color
}

function getRegionAndCount(data, name, year) {
  var arr = data.filter(e => {return e.States === name})
  return arr[0]? [arr[0][year], arr[0].Region] : [0, ""]
}

function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
        factor = 0.5;
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
}

function interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1),
        interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for(var i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
}

function getRandom(arr, n) {
    var result = arr
    var remove = arr.length - n
    for (let i = 0; i < remove; i++){
      result.splice(( i * Math.ceil(result.length / (remove + 1))), 1)
    }
    if (result.length > n) getRandom(result, n)
    return result
}
