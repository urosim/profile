var width = 500
var height = 500
var radius = [200, 165]
var radian = [-0.75, 0.75]
var strokeWidth = 1
var gap = 0.17
var radioRadius = 0.7

// Parameters
var minValue = 0
var maxValue = 1000
var unit = "%"
var colorRanges = [
  {from: 0, to: 50, color: "green"},
  {from: 50, to: 78, color: "yellow"},
  {from: 78, to: 100, color: "red"}
]

var trend = document.getElementById("trend").value
var value = document.getElementById("value").value

var redrawable = []

var svg = d3.select("#chart_area")
.append("svg")
.attr("width", width)
.attr("height", height)

drawChart({trend, value})

function drawChartHandle () {

  var trend = document.getElementById("trend").value
  var value = document.getElementById("value").value
  
  drawChart({trend, value})
}

function drawChart (values) {

  const {trend, value} = values

  if (value > maxValue) {
    alert("Value must be max " + maxValue)
    return
  }

  if (value < minValue) {
    alert("Value must be min " + minValue)
    return
  }

  var color = colorRanges[0].color

  redrawable && redrawable.map((chart) => {
    chart.remove()
  })

  redrawable = []
  
  colorRanges.some((range, index) => {
    color = range.color
    return value / (maxValue - minValue) * 100 >= range.from && value / (maxValue - minValue) * 100 <= range.to
  })

  var arc = d3.arc()
      .innerRadius(radius[1])
      .outerRadius(radius[0])
      .startAngle(Math.PI * radian[0])
      .endAngle(Math.PI * radian[1])
      
  redrawable.push(svg.append("path")
      .attr("d", arc)
      .attr("fill", color)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", "black")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"))
  
  // axis text
  redrawable.push(svg.append("text")
      .attr("class", "axis")
      .attr("transform", "translate(" + (0) + ", 0)")
      .attr("x", width / 2 + Math.sin(Math.PI * radian[0]) * radius[0])
      .attr("y", height / 2 - Math.cos(Math.PI * radian[0]) * radius[0])
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(minValue))

  redrawable.push(svg.append("text")
      .attr("class", "axis")
      .attr("transform", "translate(" + (0) + ", 0)")
      .attr("x", width / 2 + Math.sin(Math.PI * radian[1]) * radius[0])
      .attr("y", height / 2 - Math.cos(Math.PI * radian[1]) * radius[0])
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(maxValue))

  // inside chart Text
  redrawable.push(svg.append("text")
      .attr("class", "upperTitle")
      .attr("transform", "translate(" + (0) + ", 0)")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("dy", "0em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-family", "sans-serif")
      .style("font-size", "100px")
      .style('font-weight', '700')
      .text(Math.ceil(value / (maxValue - minValue) * 100)))

  redrawable.push(svg.append("text")
      .attr("class", "upperValue")
      .attr("transform", "translate(" + (0) + ", 0)")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-family", "sans-serif")
      .style("font-size", "50px")
      .style('font-weight', '700')
      .text(unit))

  // Get Points coordinates
  const centerRadius = radius[0] / 2 + radius[1] / 2
  const firstPointRadius = (radius[0] - radius[1]) / 2 + 5
  var firstPointRadian = value / (maxValue - minValue) * (radian[1] - radian[0]) + radian[0] + 0.5

  let points = []

  let gapRadius = 0
  if (trend == 'up') {
    for(var i = 0; i < 4; i++) {
      points.push([width / 2 - centerRadius * Math.cos(Math.PI * firstPointRadian - gapRadius), height / 2 - centerRadius * Math.sin(Math.PI * firstPointRadian - gapRadius), Math.round(firstPointRadius * Math.pow(radioRadius, i))])
      gapRadius += gap * Math.pow(radioRadius, i - 1)
    }
  } else {
    for(var i = 0; i < 4; i++) {
      points.push([width / 2 - centerRadius * Math.cos(Math.PI * firstPointRadian + gapRadius), height / 2 - centerRadius * Math.sin(Math.PI * firstPointRadian + gapRadius), Math.round(firstPointRadius * Math.pow(radioRadius, i))])
      gapRadius += gap * Math.pow(radioRadius, i - 1)
    }
  }

  // Points
  points.map((point, index) => {
    redrawable.push(svg.append('circle')
      .attr('cx', point[0])
      .attr('cy', point[1])
      .attr('r', point[2])
      .style('fill', "#000000CC"))
  })
}
