import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import './style.css';

import { graph1, graph2} from './data';

console.log(graph1);

// const max = graph1.links.reduce((prev, current, i) => prev += current.value, 0);
// console.log(max);

const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 400 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;

// createGraph('#graphLeft', 'left');
const createGraph = (id, type) => {
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
    nodes: graph1.nodes.map(d => Object.assign({}, d)),
    links: graph1.links.map(d => Object.assign({}, d))
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
    .attr("stroke-width", d => Math.max(1, d.width));

  // left type
  d3.select(id)
    .append("span")
    .selectAll()
    .data(nodes.filter(n => n.index !== 0))
    .join("span")
      .style("width", "125px")
      .style("position", "absolute")
      .style("top", d => `${d.y0 + 8}px`)
      .style("left", d => `${d.x0 - 100}px`)
      .text(d => d.name);
      
  d3.select(id)
    .append("span")
    .selectAll()
    .data(links)
    .join("span")
        .style("width", "125px")
        .style("position", "absolute")
        .style("top", d => `${d.y1}px`)
        .style("left",`${width - 50}px`)
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

createGraph('#graphLeft', 'left');

// const svg = d3.select("#graphLeft").append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// const group = svg.append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// const sankeyD3 = sankey()
//   .nodeWidth(20)
//   .nodePadding(20)
//   .size([width, height]);

// const {nodes, links} = sankeyD3({
//   nodes: graph1.nodes.map(d => Object.assign({}, d)),
//   links: graph1.links.map(d => Object.assign({}, d))
// });

// console.log(graph1);
// console.log(nodes, links);

// const link = group.append("g")
//   .attr("fill", "none")
//   .attr("stroke-opacity", 0.2)
//   .attr("stroke", "#000")
//   .selectAll()
//   .data(links)
//   .join("g")
//   .style("mix-blend-mode", "multiply");
// link.append("path")
//   .attr("d", sankeyLinkHorizontal())
// // .attr("stroke", linkColor === "source-target" ? (d) => d.uid
// //     : linkColor === "source" ? (d) => color(d.source.category)
// //     : linkColor === "target" ? (d) => color(d.target.category) 
// //     : linkColor)
//   .attr("stroke-width", d => Math.max(1, d.width));

// d3.select("#graphLeft")
//   .append("span")
//   .selectAll()
//   .data(nodes.filter(n => n.index !== 0))
//   .join("span")
//     .style("width", "125px")
//     .style("position", "absolute")
//     .style("top", d => `${d.y0 + 8}px`)
//     .style("left", d => `${d.x0 - 100}px`)
//     .text(d => d.name);
//     // .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
//     // .attr("y", d => (d.y1 + d.y0) / 2)
//     // .attr("dy", "0.35em")
//     // .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    
// d3.select("#graphLeft")
//   .append("span")
//   .selectAll()
//   .data(links)
//   .join("span")
//       .style("width", "125px")
//       .style("position", "absolute")
//       .style("top", d => `${d.y1}px`)
//       .style("left", d => `${380}px`)
//       .text(d => d.value);
//       // .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
//       // .attr("y", d => (d.y1 + d.y0) / 2)
//       // .attr("dy", "0.35em")
//       // .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")

// const rect = group.append("g")
//   .attr("stroke", "#000")
//   .attr("stroke-opacity", 0.2)
//   .append("rect")
//     .attr("x", nodes[0].x0)
//     .attr("y", nodes[0].y0)
//     .attr("height", nodes[0].y1 - nodes[0].y0)
//     .attr("width", nodes[0].x1 - nodes[0].x0)
//     .attr("fill", '#fff');

