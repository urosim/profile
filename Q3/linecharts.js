var GT_username = "ngupta327"

var symbolBylegend = {'5_5.9': "circle", '6_6.9': "triangle", '7_7.9': "diamond", '8.0+': "square"}
// load csv and then chart
d3.csv("earthquakes.csv").then(function (data) {
  getChart1(data);
  getChart2(data);
  getChart3(data);
  getChart4(data);
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
  var data_columns = data.columns.filter(function (e) { return e !== 'year' && e !== 'Estimated Deaths' })

  //get max and min value of x axis
  var data_years = [];
  data.map(res => {
    data_years.push(res.year)
  })
  var x_max_value = Math.max.apply(Math, data_years);
  var x_min_value = Math.min.apply(Math, data_years);

  var allGroup = data_columns;
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(["#900C3F", "#C70039", "#FF5733", "#FFC300"]);

  // Reformat the data: we need an array of arrays of {x, y} tuples
  var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: d.year, value: +d[grpName] };
      })
    };
  });

  var _arr = [];
  dataReady.map(cur => {
    cur.values.map(d => {
      _arr.push(d.value);
    })
  })

  var y_max_value = Math.max.apply(Math, _arr);

  var x = d3.scaleLinear()
    .domain([x_min_value, x_max_value])
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style('color', 'black')
    .call(d3.axisBottom(x));

  // label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text("Year");

  var y = d3.scaleLinear()
    .domain([0, y_max_value])
    .range([height, 0]);
  svg.append("g")
    .style('color', 'black')
    .call(d3.axisLeft(y));

  // Y axis label:
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Num of Earthquakes");

  //adding title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("Earthquake Statistics for 2000-2015");

  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) })

  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("class", function (d) { return d.name })
    .attr("d", function (d) { return line(d.values) })
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 1)
    .style("fill", "none");

  var legend_keys = allGroup.reverse();
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width + 15) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) { return d; })
    .attr("transform", "translate(30,9)"); //align texts with boxes

  lineLegend.append("rect")
    .attr("fill", function (d, i) { return myColor(d); })
    .attr("width", 20).attr("height", 10);
}

function getChart2(data) {
  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 160, bottom: 80, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var data_columns = data.columns.filter(function (e) { return e !== 'year' && e !== 'Estimated Deaths' })

  var allGroup = data_columns;

  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(["#900C3F", "#C70039", "#FF5733", "#FFC300"]);

  // Reformat the data: we need an array of arrays of {x, y} tuples
  var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: d.year, value: +d[grpName] };
      })
    };
  });

  var estimated_deaths = [];
  data.map(cur => {
    estimated_deaths.push(cur["Estimated Deaths"])
  })

  var _arr = [];
  dataReady.map(cur => {
    cur.values.map(d => {
      _arr.push(d.value);
    })
  })

  var max_value = Math.max.apply(Math, _arr);
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year }))
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style('color', 'black')
    .call(d3.axisBottom(x));

  // label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text("Year");


  var y = d3.scaleLinear()
    .domain([0, max_value])
    .range([height, 0]);
  svg.append("g")
    .style('color', 'black')
    .call(d3.axisLeft(y));
  // Y axis label:
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Num of Earthquakes");

  //adding title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("Earthquake Statistics for 2000-2015 with symbols");

  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) });

  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("class", function (d) { return d.name })
    .attr("d", function (d) { return line(d.values) })
    // .attr("simbol", simbols)
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 1)
    .style("fill", "none");

  var legend_keys = allGroup.reverse();
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width + 15) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) { return d; })
    .attr("transform", "translate(30,9)"); //align texts with boxes

  lineLegend.append("rect")
    .attr("fill", function (d, i) { return myColor(d); })
    .attr("width", 20).attr("height", 10);

  var symbol = function (i) {
    return d3.symbol()
      .size(81)
      .type(d3.symbols[0]);
  };

  var j = -1;
  dataReady.forEach(function (data, i) {
    switch (symbolBylegend[data.name]) {
      case "circle":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", d3.symbol())
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.2 + ")";

          });
        break;
      case "triangle":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 10 L 0 -20 L 15 10 L -15 10"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
      case "diamond":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 0 L 0 -20 L 15 0 L 0 20 Z"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
      case "square":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 15 L -15 -15 L 15 -15 L 15 15 Z"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
    }
  })
}

function getChart3(data) {
  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 160, bottom: 80, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  var svg = d3.select("#chart3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var data_columns = data.columns.filter(function (e) { return e !== 'year' && e !== 'Estimated Deaths' })

  var allGroup = data_columns;

  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(["#900C3F", "#C70039", "#FF5733", "#FFC300"]);
  // Reformat the data: we need an array of arrays of {x, y} tuples
  var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: d.year, value: +d[grpName] };
      })
    };
  });

  var estimated_deaths = [];
  data.map(cur => {
    estimated_deaths.push(cur["Estimated Deaths"])
  })

  var _arr = [];
  dataReady.map(cur => {
    cur.values.map(d => {
      _arr.push(d.value);
    })
  })

  var max_value = Math.max.apply(Math, _arr);
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year }))
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style('color', 'black')
    .call(d3.axisBottom(x));
  // label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text("Year");


  var y = d3.scaleSqrt()
    .domain([0, max_value])
    .range([height, 0]);
  svg.append("g")
    .style('color', 'black')
    .call(d3.axisLeft(y));
  // Y axis label:
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Num of Earthquakes");

  //adding title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("Earthquake Statistics for 2000-2015 (Square root Scale)");

  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) });

  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("class", function (d) { return d.name })
    .attr("d", function (d) { return line(d.values) })
    // .attr("simbol", simbols)
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 1)
    .style("fill", "none");

  var legend_keys = allGroup.reverse();
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width + 15) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) { return d; })
    .attr("transform", "translate(30,9)"); //align texts with boxes

  lineLegend.append("rect")
    .attr("fill", function (d, i) { return myColor(d); })
    .attr("width", 20).attr("height", 10);

  var symbol = function (i) {
    return d3.symbol()
      .size(81)
      .type(d3.symbols[0]);
  };

  var j = -1;
  dataReady.forEach(function (data, i) {
    switch (symbolBylegend[data.name]) {
      case "circle":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", d3.symbol())
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.2 + ")";

          });
        break;
      case "triangle":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 10 L 0 -20 L 15 10 L -15 10"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
      case "diamond":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 0 L 0 -20 L 15 0 L 0 20 Z"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
      case "square":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 15 L -15 -15 L 15 -15 L 15 15 Z"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
    }
  })
}

function getChart4(data) {
  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 160, bottom: 80, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  var svg = d3.select("#chart4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var data_columns = data.columns.filter(function (e) { return e !== 'year' && e !== 'Estimated Deaths' })

  var allGroup = data_columns;

  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(["#900C3F", "#C70039", "#FF5733", "#FFC300"]);
  // Reformat the data: we need an array of arrays of {x, y} tuples
  var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: d.year, value: +d[grpName] };
      })
    };
  });

  var estimated_deaths = [];
  data.map(cur => {
    estimated_deaths.push(cur["Estimated Deaths"])
  })

  var _arr = [];
  dataReady.map(cur => {
    cur.values.map(d => {
      _arr.push(d.value);
    })
  })

  var max_value = Math.max.apply(Math, _arr);
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year }))
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style('color', 'black')
    .call(d3.axisBottom(x));
  // label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text("Year");


  var y = d3.scaleLog()
    .domain([1, max_value])
    .range([height, 0]);
  //  .base(2);
  svg.append("g")
    .style('color', 'black')
    .call(d3.axisLeft(y));
  // Y axis label:
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Num of Earthquakes");

  //adding title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("Earthquake Statistics for 2000-2015 (Log Scale)");

  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) });

  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("class", function (d) { return d.name })
    .attr("d", function (d) { return line(d.values).replace(/Infinity/g, 370) })
    // .attr("simbol", simbols)
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 1)
    .style("fill", "none");

  var legend_keys = allGroup.reverse();
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width + 15) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) { return d; })
    .attr("transform", "translate(30,9)"); //align texts with boxes

  lineLegend.append("rect")
    .attr("fill", function (d, i) { return myColor(d); })
    .attr("width", 20).attr("height", 10);

  var j = -1;

  dataReady.map(cur => {
    cur.values.map(d => {
      if (d.value < 1) {
        d.value = 1;
      }
    })
  })

  dataReady.forEach(function (data, i) {
    switch (symbolBylegend[data.name]) {
      case "circle":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", d3.symbol())
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.2 + ")";

          });
        break;
      case "triangle":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 10 L 0 -20 L 15 10 L -15 10"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
      case "diamond":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 0 L 0 -20 L 15 0 L 0 20 Z"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
      case "square":
        svg.selectAll('symbols111')
          .data(data.values)
          .enter()
          .append('path')
          .attr("class", function (d) { j++; })
          .attr('fill', myColor(i))
          .attr("stroke", myColor(i))
          .attr("d", function (d) {
            return "M -15 15 L -15 -15 L 15 -15 L 15 15 Z"
          })
          .attr("transform", function (d) {
            j++;
            return "translate(" + x(d.time) +
              "," + y(d.value) + "),scale(" + Math.log(estimated_deaths[j % 16]) * 0.05 + ")";

          });
        break;
    }
  })
  // add name
  svg.append("text")
      .attr("x", 850)
      .attr("y", 420)
      .attr("text-anchor", "end")
      .text(GT_username);
}

function downloadPDF() {

  var doc = new jsPDF('l', '', 'a4')
  var chart1 = document.getElementById('chart1').innerHTML;
  var chart2 = document.getElementById('chart2').innerHTML;
  var chart3 = document.getElementById('chart3').innerHTML;
  var chart4 = document.getElementById('chart4').innerHTML;
  // if (chart1) chart1 = chart1.replace(/\r?\n|\r/g, '').trim();
  var canvas = document.createElement('canvas');
  canvg(canvas, chart1);
  var imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
  doc.addPage();
  canvg(canvas, chart2);
  var imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
  doc.addPage();
  canvg(canvas, chart3);
  var imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
  doc.addPage();
  canvg(canvas, chart4);
  var imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
  // Generate PDF
  doc.save('linrcharts.pdf')
}
