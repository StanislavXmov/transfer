import * as d3 from 'd3';
import { fromCountryField, fromRegionField, inType, insideType, outType, region, toRegionField, typeField } from './fields';

const colors = {
  'Top': '#FEFEFE',
  'Europe, ex. Top Leagues': '#1FB35F',
  'Asia': '#F051AE',
  'South America': '#FEB74F',
  'North America': '#55AFE1',
  'Africa': '#FD3A34',
  'No club': '#C1C1C1',
  'Retired': '#C1C1C1',
};

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
    const v = Number(d['Market value'].split(',').join(''));
    if (v >= x) {
      return axis.x[x];
    }
  }
}

const getY = (d) => {
  for (let j = axisData.length - 1; j >= 0; j--) {
    let y = axisData[j - 1];
    if (d['Fee'] === '?') {
      return axis.y['0'];
    }
    if (d['Fee'] >= y) {
      return axis.y[y];
    }
  }
}

const getFromColor = (d) => {
  return colors[d[fromRegionField]] || colors['No club'];
}

const getToColor = (d) => {
  return colors[d[toRegionField]] || colors['No club'];
}

const createPoints = (data) => {
  svg.append("g")
    .selectAll()
    .data(data)
    .join("clipPath")
    .attr("id", (d, i) => `cut-off-${i}`)
      .append("rect")
      .attr("x", d => getX(d)(Number(d['Market value'].split(',').join(''))) + axisStep)
      .attr("y", d => getY(d)(d['Fee'] === '?' ? 0 : d['Fee']) - axisStep / 4 - 5)
      .attr("width", "7")
      .attr("height", "10");

  svg.append("g")
    .selectAll()
    .data(data)
    .join("clipPath")
    .attr("id", (d, i) => `cut-off2-${i}`)
      .append("rect")
      .attr("x", d => getX(d)(Number(d['Market value'].split(',').join(''))) + axisStep - 7)
      .attr("y", d => getY(d)(d['Fee'] === '?' ? 0 : d['Fee']) - axisStep / 4 - 5)
      .attr("width", "7")
      .attr("height", "10");

  svg.append("g")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
      .selectAll()
      .data(data)
      .join("circle")
        .attr("cx", d => getX(d)(Number(d['Market value'].split(',').join(''))) + axisStep)
        .attr("cy", d => getY(d)(d['Fee'] === '?' ? 0 : d['Fee']) - axisStep / 4)
        .attr("fill", d => getToColor(d))
        .attr("clip-path", (d, i) => `url(#cut-off-${i})`)
        .attr("r", 5)

  svg.append("g")
  .attr("stroke", "#000")
  .attr("stroke-opacity", 0.2)
    .selectAll()
    .data(data)
    .join("circle")
      .attr("cx", d => getX(d)(Number(d['Market value'].split(',').join(''))) + axisStep)
      .attr("cy", d => getY(d)(d['Fee'] === '?' ? 0 : d['Fee']) - axisStep / 4)
      .attr("fill", d => getFromColor(d))
      .attr("clip-path", (d, i) => `url(#cut-off2-${i})`)
      .attr("r", 5)
}

const getCsv = async () => {
  const data = await d3.csv('./football-transfers.csv');
  // console.log(data);

  // const testData = data.splice(0, 200);
  // console.log(testData);
  // createPoints(data);

  let filteredByCountry = [];
  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === insideType || d[typeField] === outType);

  filteredByCountry = filteredByType.filter(d => 
    d[fromCountryField] === 'Germany' 
    && d[toRegionField] === region 
    && d[fromRegionField] !== region
  );

  console.log(filteredByCountry);
  createPoints(filteredByCountry);
}

getCsv();
