import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import './style.css';

import { graph1, graph2, graphNext} from './data';
import { filterFromTopToRegion } from './filterFromTopToRegion';


const getCsv = async () => {
  const data = await d3.csv('./football-transfers.csv');
  // console.log(data);
  createGraph('#graphRight', 'right', filterFromTopToRegion(data));
}

getCsv();

const clearGraph = (id, type) => {
  const el = document.querySelector(id);
  el.innerHTML = '';
}

const cb = {
  next: () => {
    clearGraph('#graphRight', 'right');
    createGraph('#graphRight', 'right', graphNext);
  }
}

// const max = graph1.links.reduce((prev, current, i) => prev += current.value, 0);

const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 400 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;

const createGraph = (id, type, graph) => {
  const svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  const group = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const sankeyD3 = sankey()
    .nodeWidth(20)
    .nodePadding(20)
    .size([width, height]);

  const {nodes, links} = sankeyD3({
    nodes: graph.nodes.map(d => Object.assign({}, d)),
    links: graph.links.map(d => Object.assign({}, d))
  });

  const link = group.append("g")
  .attr("fill", "none")
  .attr("stroke-opacity", 0.2)
  .attr("stroke", "#000")
  .selectAll()
  .data(links)
  .join("g")
  .style("mix-blend-mode", "multiply");
  link.append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke-width", d => Math.max(1, d.width))
    .style("cursor", "pointer")
    .on("click", (e, d) => {
      console.log({e, d}, d.value);
      if (cb[d.cb]) {
        cb[d.cb]();
      }
    });

  // left type
  d3.select(id)
    .append("span")
    .selectAll()
    .data(nodes.filter(n => n.index !== 0))
    .join("span")
      .style("width", "125px")
      .style("position", "absolute")
      .style("top", d => `${d.y0 + 8}px`)
      .style("left", d => type === 'left' ? `${d.x0 - 100}px` : `${d.x0 + 32}px`)
      .text(d => d.name);
    
      
  d3.select(id)
    .append("span")
    .selectAll()
    .data(links)
    .join("span")
        .style("width", "125px")
        .style("position", "absolute")
        .style("top", d => type === 'left' ? `${d.y1}px` : `${d.y0}px`)
        .style("left", type === 'left' ? `${width - 50}px` : `${44}px`)
        .text(d => d.value);

  const rect = group.append("g")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
    .append("rect")
      .attr("x", nodes[0].x0)
      .attr("y", nodes[0].y0)
      .attr("height", nodes[0].y1 - nodes[0].y0)
      .attr("width", nodes[0].x1 - nodes[0].x0)
      .attr("fill", '#fff');
}

// createGraph('#graphLeft', 'left', graph1);
// createGraph('#graphRight', 'right', graph2);


