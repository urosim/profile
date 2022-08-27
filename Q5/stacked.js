var GT_username = "ngupta327"
// load csv and then chart
d3.csv("earthquake.csv").then(function (data) {
  chart(data)
})

function chart(csv) {

	var keys = csv.columns.slice(2);

	var year   = [...new Set(csv.map(d => d.Year))]
	var states = [...new Set(csv.map(d => d.State))]

	var options = d3.select("#year").selectAll("option")
		.data(year)
	.enter().append("option")
		.text(d => d)

  var margin = { top: 50, right: 50, bottom: 0, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

	var svg = d3.select("#stacked_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

	var x = d3.scaleBand()
		.range([margin.left, width - margin.right])
		.padding(0.1)

	var y = d3.scaleLinear()
		.rangeRound([height - margin.bottom, margin.top])

	var xAxis = svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.attr("class", "x-axis")

	var yAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.attr("class", "y-axis")

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("font-size", "15px")
    .style("text-anchor", "middle")
    .text("Num of Earthquakes");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    // .style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("Visualizing Earthquake Counts by State");

  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top) + ")")
    .style("text-anchor", "middle")
    .text("Year");

	var z = d3.scaleOrdinal()
		.range(["#b33040", "#d25c4d", "#f2b447"])
		.domain(keys);

  var legend_keys = csv.columns.slice(2)
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) { return d; })
    .attr("transform", "translate(30,20)"); //align texts with boxes

  lineLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 14)
    .attr("r", 6)
    .attr("fill", function (d, i) { return z(d); })

	update(d3.select("#year").property("value"), 0)

	function update(input, speed) {

		var data = csv.filter(f => f.Year == input)

		data.forEach(function(d) {
			d.total = d3.sum(keys, k => +d[k])
			return d
		})

		y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

		svg.selectAll(".y-axis").transition().duration(speed)
			.call(d3.axisLeft(y).ticks(null, "s"))

		data.sort(d3.select("#sort").property("checked")
			? (a, b) => b.total - a.total
			: (a, b) => states.indexOf(a.State) - states.indexOf(b.State))

		x.domain(data.map(d => d.State));

		svg.selectAll(".x-axis").transition().duration(speed)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		var bars = svg.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => e.data.State);

		bars.exit().remove()

		bars.enter().append("rect")
			.attr("width", x.bandwidth())
			.merge(bars)
		.transition().duration(speed)
			.attr("x", d => x(d.data.State))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]))

		var text = svg.selectAll(".text")
			.data(data, d => d.State);

		text.exit().remove()

		text.enter().append("text")
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.merge(text)
		.transition().duration(speed)
			.attr("x", d => x(d.State) + x.bandwidth() / 2)
			.attr("y", d => y(d.total) - 5)
			.text(d => d.total)
	}

	var select = d3.select("#year")
		.on("change", function() {
			update(this.value, 750)
		})

	var checkbox = d3.select("#sort")
		.on("click", function() {
			update(select.property("value"), 750)
		})
}
