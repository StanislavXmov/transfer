import * as d3 from 'd3';

const data = [
  {'Market value': 2000, 'Fee': 1000},
  {'Market value': 100_000, 'Fee': 100_000},
  {'Market value': 10000, 'Fee': 10000},
  {'Market value': 500000, 'Fee': 500000},
  {'Market value': 100_000, 'Fee': 0},
  {'Market value': 1_000_000, 'Fee': 2_000_000},
];

console.log(data);

const color = d3.scaleSequential()
  .interpolator(d3.interpolateCool);
const color2 = d3.scaleSequential()
  .interpolator(d3.interpolateBlues);

const axisData = [0, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
const axisStep = 75;

const width = (axisData.length - 1) * axisStep + axisStep;
const height = (axisData.length - 1) * axisStep + axisStep;

const axis = {
  x: {},
  y: {},
};

axisData.forEach((step, i) => {
  if (!axisData[i + 1]) {
    return;
  }
  axis.x[step] = d3.scaleLinear()
    .domain([step, axisData[i + 1]])
    .range([i * axisStep, (i + 1) * axisStep]);

  axis.y[step] = d3.scaleLinear()
    .domain([step, axisData[i + 1]])
    .range([height - (i * axisStep),height - (i + 1) * axisStep]);
});

const svg = d3.select('#transferContainer').append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

Object.keys(axis.x).forEach(key => {
  svg.append("g")
    .attr("transform", `translate(${axisStep},${height - axisStep / 4})`)
    .call(d3.axisBottom(axis.x[key]).ticks(1))
    .call(g => g.select(".domain").remove());
});

Object.keys(axis.y).forEach(key => {
  svg.append("g")
    .attr("transform", `translate(${axisStep}, ${- axisStep / 4})`)
    .call(d3.axisLeft(axis.y[key]).ticks(1))
    .call(g => g.select(".domain").remove());
});

const getX = (d) => {
  for (let j = axisData.length - 1; j >= 0; j--) {
    const x = axisData[j - 1];
    if (d['Market value'] >= x) {
      return axis.x[x];
    }
  }
}

const getY = (d) => {
  for (let j = axisData.length - 1; j >= 0; j--) {
    const y = axisData[j - 1];
    if (d['Fee'] >= y) {
      return axis.y[y];
    }
  }
}

svg.append("g")
  .selectAll()
  .data(data)
  .join("clipPath")
  .attr("id", (d, i) => `cut-off-${i}`)
    .append("rect")
    .attr("x", d => getX(d)(d['Market value']) + axisStep)
    .attr("y", d => getY(d)(d['Fee']) - axisStep / 4 - 5)
    .attr("width", "7")
    .attr("height", "10");

svg.append("g")
  .selectAll()
  .data(data)
  .join("clipPath")
  .attr("id", (d, i) => `cut-off2-${i}`)
    .append("rect")
    .attr("x", d => getX(d)(d['Market value']) + axisStep - 7)
    .attr("y", d => getY(d)(d['Fee']) - axisStep / 4 - 5)
    .attr("width", "7")
    .attr("height", "10");

svg.append("g")
  .attr("stroke", "#000")
  .attr("stroke-opacity", 0.2)
    .selectAll()
    .data(data)
    .join("circle")
      .attr("cx", d => getX(d)(d['Market value']) + axisStep)
      .attr("cy", d => getY(d)(d['Fee']) - axisStep / 4)
      .attr("fill", d => color(d['Fee']))
      .attr("clip-path", (d, i) => `url(#cut-off-${i})`)
      .attr("r", 5)

svg.append("g")
.attr("stroke", "#000")
.attr("stroke-opacity", 0.2)
  .selectAll()
  .data(data)
  .join("circle")
    .attr("cx", d => getX(d)(d['Market value']) + axisStep)
    .attr("cy", d => getY(d)(d['Fee']) - axisStep / 4)
    .attr("fill", d => color2(d['Fee']))
    .attr("clip-path", (d, i) => `url(#cut-off2-${i})`)
    .attr("r", 5)
      


