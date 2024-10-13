async function draw() {
  const data = await d3.csv("data.csv");

  const xAccessor = d => +d.Year;
  const yAccessor = d => +d.Passengers;

  const margin = 50;
  const width = 800 - margin * 2;
  const height = 600 - margin * 2;

  const svgCtr = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([85, d3.max(data, yAccessor)])
    .range([height, 0]);

  const area = d3
    .area()
    .x(d => xScale(d.Year))
    .y0(height)
    .y1(d => yScale(d.Passengers))
  const area1 = d3
    .area()
    .x(d => xScale(d.Year))
    .y0(height)
    .y1(height)

  const transition = d3
    .transition()
    .duration(1000)

  svgCtr
    .append("path")
    .datum(data)
    .attr("fill", "#ff6b6b88")
    .attr("stroke", "#ff6b6b")
    .attr("stroke-width", 2)
    .attr("d", area1)
    .transition( transition )
    .attr("d", area);

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.format("d"));
  svgCtr
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d => d + "M");
  svgCtr
    .append("g")
    .call(yAxis);


  const symbolGenerator = d3
    .symbol()
    .type(d3.symbolStar)
    .size(30);
  
  svgCtr
    .selectAll(".dot")
    .data(data)
    .join("circle")
    .classed("dot", true)
    .attr("cx", d => xScale(d.Year))
    .attr("cy", height)
    .transition(transition)
    .attr("cy", d => yScale(d.Passengers))
    .attr("r", 4)
    .attr("fill", "#ff6b6b")

  // Draw the largest dot
  const maxPassengersObjt = (data.reduce((maxObj, currObj) => +currObj.Passengers > +maxObj.Passengers ? currObj : maxObj));
  svgCtr
    .append("path")
    .attr("fill", "#006b6b")
    .attr("stroke", "#006b6b")
    .attr("stroke-width", 2)
    .attr("d", symbolGenerator)
    .classed("anime", true)
    .attr("transform", `translate(${xScale(maxPassengersObjt.Year)}, ${height})`)
    .transition(transition)
    .attr("transform", `translate(${xScale(maxPassengersObjt.Year)}, ${yScale(maxPassengersObjt.Passengers)})`)
  
   svgCtr
     .selectAll(".dot-label")
     .data(data)
     .join("text")
     .classed("dot-label", true)
     .text(d => d.Passengers)
     .attr("text-anchor", "middle")
     .attr("dominant-baseline", "central")
     .attr("x", d => xScale(d.Year))
     .attr("y", d => yScale(d.Passengers) + 30)
     .transition(transition)
     .style("opacity", 0)
     .duration(1100)
     .style("opacity", 1)
     .attr("y", d => yScale(d.Passengers) - 10)
  
}

draw()