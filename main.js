import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import './style.css';

import { graph1, graph2, graphNext} from './data';
import { filterFromTopToRegion } from './filterFromTopToRegion';
import { filterFromRegionInInsideToLegueTop } from './filterFromRegionInInsideToLegueTop';
import { filterFromRegionOutToLegueTop } from './filterFromRegionOutToLegueTop';
import { filterFromLeagueTopOutInsideToRegion } from './filterFromLeagueTopOutInsideToRegion';
import { filterToTopInInside } from './filterToTopInInside';
import { filterFromTopOutInside } from './filterFromTopOutInside';
import { filterByCountryToTop } from './filterByCountryToTop';
import { filterByTopToCountry } from './filterByTopToCountry';

const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 400 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;
const onChangeElement = document.getElementById('changeGraph');
const signingElement = document.getElementById('signing');
const outingElement = document.getElementById('outing');


// Что происходит по клику в регион
// 1. Если галочка снята (все лиги вместе), то 
// слева From Country Filter Status == (in&inside) Region == (выбранный регион) To Top
// справа From Top Status == (out&inside) To Country Region == (выбранный регион)

// 2. Если галочка стоит (лиги отдельно), то 
// слева From Country Filter Status == (in&inside) Region == (выбранный регион)  To League Filter Region == Top 
// справа From League Region == Top, Status == (out&inside) To Country Region == (выбранный регион)

const getCsv = async () => {
  const data = await d3.csv('./football-transfers.csv');
  console.log(data);

  const leftData = filterToTopInInside(data);
  const rightData = filterFromTopOutInside(data);

  signingElement.textContent = leftData.transfers;
  outingElement.textContent = rightData.transfers;

  if (leftData.transfers > rightData.transfers) {
    const dh = rightData.transfers / leftData.transfers;
    createGraph('#graphLeft', 'left', leftData, height, data);
    createGraph('#graphRight', 'right', rightData, height * dh, data);
  } else {
    const dh = leftData.transfers / rightData.transfers;
    createGraph('#graphRight', 'right', rightData, height, data);
    createGraph('#graphLeft', 'left', leftData, height * dh, data);
  }

  onChangeElement.addEventListener('change', (e) => {
    clearGraph('#graphRight', 'right');
    clearGraph('#graphLeft', 'left');
    if (e.target.checked) {
      const nextLeftData = filterFromRegionInInsideToLegueTop(data);
      const nextRightData = filterFromLeagueTopOutInsideToRegion(data);
      signingElement.textContent = nextLeftData.transfers;
      outingElement.textContent = nextRightData.transfers;

      if (nextLeftData.transfers > nextRightData.transfers) {
        const dh = nextRightData.transfers / nextLeftData.transfers;
        createGraph('#graphLeft', 'left', nextLeftData, height);
        createGraph('#graphRight', 'right', nextRightData, height * dh);
      } else {
        const dh = nextLeftData.transfers / nextRightData.transfers;
        createGraph('#graphRight', 'right', nextRightData, height);
        createGraph('#graphLeft', 'left', nextLeftData, height * dh);
      }
    } else {
      if (leftData.transfers > rightData.transfers) {
        const dh = rightData.transfers / leftData.transfers;
        createGraph('#graphLeft', 'left', leftData, height);
        createGraph('#graphRight', 'right', rightData, height * dh);
      } else {
        const dh = leftData.transfers / rightData.transfers;
        createGraph('#graphRight', 'right', rightData, height);
        createGraph('#graphLeft', 'left', leftData, height * dh);
      }
    }
  });
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

const createGraph = (id, type, graph, height, data) => {
  const svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  const group = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const sankeyD3 = sankey()
    .nodeWidth(20)
    .nodePadding(20)
    .size([width, height])
    .nodeSort(null)
    .linkSort(null);

  const {nodes, links} = sankeyD3({
    nodes: graph.nodes.map(d => Object.assign({}, d)),
    links: graph.links.map(d => Object.assign({}, d))
  });
  // console.log({nodes, links});
  
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
    // .on("click", (e, d) => {
    //   console.log({e, d}, d.value);
    //   if (cb[d.cb]) {
    //     cb[d.cb]();
    //   }
    // });
    .on('mouseover', (e, d) => {
      d3.select(e.target).style("opacity", 0.8);
      if (d.width > 50) {
        return;
      }
      let id;
      if (type === 'left') {
        id = d.source.name;
      } else {
        id = d.target.name;
      }
      d3.select(`[data-link="${id} ${type} ${d.index}"]`)
        .style("opacity", 1);
    })
    .on('mouseout', (e, d) => {
      d3.select(e.target).style("opacity", 1);
      if (d.width > 50) {
        return;
      }
      let id;
      if (type === 'left') {
        id = d.source.name;
      } else {
        id = d.target.name;
      }
      d3.select(`[data-link="${id} ${type} ${d.index}"]`)
        .style("opacity", 0);
    });

  // left type
  d3.select(id)
    .append("span")
    .selectAll()
    .data(nodes)
    // .data(nodes.filter(n => n.index !== 0))
    .join("span")
      .style("cursor", "pointer")
      .style("width", "125px")
      .style("position", "absolute")
      .style("top", d => `${d.y0 + 8}px`)
      .style("left", d => {
        if (type === 'left') {
          if (d.root) {
            return `${d.x0 - 200}px`;
          } else {
            return `${d.x0 - 100}px`;
          }
        } else {
          if (d.root) {
            return `${d.x0 + 100}px`;
          } else {
            return `${d.x0 + 40}px`;
          }
        }
      })
      .on("click", (e, d) => {
        if (!d.root) {
          // if (d.name === 'Europe') {
            let defaultHeight = 620;
            
            clearGraph('#graphLeft', 'left');
            clearGraph('#graphRight', 'right');
            const newRightData = filterByTopToCountry(data, d.name);
            const newLeftData = filterByCountryToTop(data, d.name);
            signingElement.textContent = newLeftData.transfers;
            outingElement.textContent = newRightData.transfers;
            
            if (newRightData.nodes.length > 10 || newLeftData.nodes.length > 10) {
              defaultHeight = 620 * 2;
              const padding = 20;
              if (newLeftData.transfers > newRightData.transfers) {
                const dh = (d3.sum(newRightData.links.map(i => i.value + padding)) - padding) / (d3.sum(newLeftData.links.map(i => i.value + padding)) - padding);
                createGraph('#graphLeft', 'left', newLeftData, defaultHeight, data);
                createGraph('#graphRight', 'right', newRightData, defaultHeight * dh, data);
              } else {
                const dh = (d3.sum(newLeftData.links.map(i => i.value + padding)) - padding) / (d3.sum(newRightData.links.map(i => i.value + padding)) - padding);
                createGraph('#graphRight', 'right', newRightData, defaultHeight, data);
                createGraph('#graphLeft', 'left', newLeftData, defaultHeight * dh, data);
              }
            } else
            if (newLeftData.transfers > newRightData.transfers) {
              const dh = newRightData.transfers / newLeftData.transfers;
              createGraph('#graphLeft', 'left', newLeftData, defaultHeight, data);
              createGraph('#graphRight', 'right', newRightData, defaultHeight * dh, data);
            } else {
              const dh = newLeftData.transfers / newRightData.transfers;
              createGraph('#graphRight', 'right', newRightData, defaultHeight, data);
              createGraph('#graphLeft', 'left', newLeftData, defaultHeight * dh, data);
            }
        }
      })
      .text(d => d.name);
    
      
  d3.select(id)
    .append("span")
    .selectAll()
    .data(links)
    .join("span")
        .attr("data-link", d => {
          if (type === 'left') {
            return `${d.source.name} ${type} ${d.index}`;
          } else {
            return `${d.target.name} ${type} ${d.index}`;
          }
        })
        .style("width", "125px")
        .style("position", "absolute")
        .style("top", d => type === 'left' ? `${d.y1}px` : `${d.y0}px`)
        .style("left", type === 'left' ? `${width - 50}px` : `${44}px`)
        .text(d => d.value)
        .style('pointer-events', 'none')
        .style("opacity",d => d.width < 50 ? 0 : 1);

  nodes.forEach(n => {
    // if (n.root) {
      group.append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .append("rect")
          .attr("x", n.x0)
          .attr("y", n.y0)
          .attr("height", n.y1 - n.y0)
          .attr("width", n.x1 - n.x0)
          .attr("fill", '#fff');
    // }
  });
}

// createGraph('#graphLeft', 'left', graph1);
// createGraph('#graphRight', 'right', graph2);


