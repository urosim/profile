var GT_username = "ngupta327"
// load csv and then chart
d3.csv("state-year-earthquakes.csv").then(function (data) {
  getChart1(data);
})

function getChart1(data) {
  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 160, bottom: 80, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var data_columns = [], data_years = [], data_group = []

  data.map((d) => {
    if (data_columns.indexOf(d.region) < 0) data_columns.push(d.region)
    if (data_years.indexOf(d.year) < 0) data_years.push(d.year)
  })

  data_columns.map((data_column) => {
    data_group.push({name: data_column, values:[]})
  })

  data_group.map((group) => {
    data_years.map((years) => {
      group.values.push({time: years, value: 0})
    })
  })

  data.map((d) => {
    data_group.map((group) => {
      if (d.region === group.name) {
        group.values.map((value) => {
          if (value.time === d.year) value.value += parseInt(d.count)
        })
      }
    })
  })

  //adding title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("US Earthquake By Region 2011-2015");

  // x axis
  var x_max_value = Math.max.apply(Math, data_years);
  var x_min_value = Math.min.apply(Math, data_years);
  var x = d3.scaleLinear()
    .domain([x_min_value, x_max_value])
    .range([0, width])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style('color', 'black')
    .call(d3.axisBottom(x).ticks(data_years.length, "f").tickFormat(d3.format("d")));
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text("");

  //  y axis
  var _arr = [];
  data_group.map(cur => {
    cur.values.map(d => {
      _arr.push(d.value);
    })
  })
  var y_max_value = Math.max.apply(Math, _arr);
  var y = d3.scaleLinear()
    .domain([0, y_max_value])
    .range([height, 0]);
  svg.append("g")
    .style('color', 'black')
    .call(d3.axisLeft(y));
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("");

  // group
  var myColor = d3.scaleOrdinal()
    .domain(data_columns)
    .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"]);

  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) })

  svg.selectAll("myLines")
    .data(data_group)
    .enter()
    .append("path")
    .attr("class", function (d) { return d.name })
    .attr("d", function (d) { return line(d.values) })
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 1)
    .style("fill", "none");

  var focus = svg.append("g")
                .attr("class", "focus")
                .style("opacity", 0)

  focus.append("circle")
    .attr("r", 15);

  var legend_keys = data_columns // .reverse()
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width + 15) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) { return d; })
    .attr("transform", "translate(15,9)"); //align texts with boxes

  lineLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 4)
    .attr("r", 6)
    .attr("fill", function (d, i) { return myColor(d); })

  data_group.forEach(function (data, i) {
    svg.selectAll('symbols111')
      .data(data.values)
      .enter()
      .append('path')
      .attr("class", function (d) {  })
      .attr('fill', myColor(i))
      .attr("stroke", myColor(i))
      .attr("d", d3.symbol())
      .attr("transform", function (d) {
        return "translate(" + x(d.time) +
          "," + y(d.value) + "),scale(0.7)";

      })
      .on("mouseover", function(d) { mouseover(x(d.time), y(d.value), d, i) })
      .on("mouseout", mouseout)
  })

  // mouse event
  function mouseout() {
    document.getElementById("chart2").innerHTML = ''
    focus.transition()
      .duration(300)
      .style("opacity", 0)
  }

  function mouseover(x, y, d, i) {
    focus.attr('fill', myColor(i))
      .attr("transform", function (d) {
        return "translate(" + x +
          "," + y + "),scale(0.5)"
      })
      .transition()
      .duration(500)
      .style("opacity", 1)

    // Get bar chart data
    var data_bar = []
    data.map((item) => {
      if(item.region === data_group[i].name && item.year === d.time) data_bar.push({state: item.state, count: parseInt(item.count)})
    })
    data_bar.sort((a, b) => {
      return  (b.count - a.count) || ((b.count === a.count) && (b.state - a.state))
    })
    drawBarChart(data_bar, d.time, data_group[i].name)
  }
}

function drawBarChart(data, year, region) {

  var margin = { top: 50, right: 160, bottom: 80, left: 100 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  //adding title
  svg.append("text")
    .attr("x", (width / 2) + 100)
    .attr("y", (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text(region + " Region Earthquake " + year);

  var g =svg.append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

  var y = d3.scaleBand().rangeRound([0, height]).padding(0.1),
      x = d3.scaleLinear().rangeRound([0, width]);

  y.domain(data.map(function(d) { return d.state; }));
  x.domain([0, d3.max(data, function(d) { return d.count; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x))

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "blue")
      .attr("y", function(d) { return y(d.state); })
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", function(d) { return x(d.count); });

}
