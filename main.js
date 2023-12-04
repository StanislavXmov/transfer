import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import './style.css';

import { setPointData } from './transfersGraph';

import { filterByCountryToTop } from './filterByCountryToTop';
import { filterByTopToCountry } from './filterByTopToCountry';

import { countries, europeLeft, europeRight, regionsOrder } from './order';
import { toTopInInside } from './filter/toTopInInside';
import { fromTopOutInside } from './filter/fromTopOutInside';
import { fromRegionInInsideToLegueTop } from './filter/fromRegionInInsideToLegueTop';
import { fromLeagueTopOutInsideToRegion } from './filter/fromLeagueTopOutInsideToRegion';

import { fromCountryFromLeague } from './filter/countries/fromCountryFromLeague';
import { fromLeagueToCountry } from './filter/countries/fromLeagueToCountry';
import { fromCountries } from './filter/checked/fromCountries';
import { toCountries } from './filter/checked/toCountries';
import { fromLegues } from './filter/checked/fromLegues';
import { toLeagues } from './filter/checked/toLeagues';
import { fromLeagueField, fromTeamField, toLeagueField, toTeamField } from './fields';
import { fromLeagueToTeams } from './filter/teams/fromLeagueToTeams';
import { fromLeagueToTeamsOut } from './filter/teams/fromLeagueToTeamsOut';
import { fromTeams } from './filter/checked/fromTeams';
import { toTeams } from './filter/checked/toTeams';
import { fromTeamsToFootballmans } from './filter/footballmans/fromTeamsToFootballmans';
import { fromTeamsToFootballmansOut } from './filter/footballmans/fromTeamsToFootballmansOut';
import { fromFootballmans } from './filter/checked/fromFootballmans';
import { toFootballmans } from './filter/checked/toFootballmans';

const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 400 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;
const onChangeElement = document.getElementById('changeGraph');
const changeGraphLabelElement = document.getElementById('changeGraphLabel');
const signingElement = document.getElementById('signing');
const outingElement = document.getElementById('outing');
const signingFromElement = document.getElementById('signingFrom');
const outingFromElement = document.getElementById('outingFrom');

const filterStep1Button = document.getElementById('filterStep1Button');
const filterStep1ButtonTitle = document.getElementById('filterStep1ButtonTitle');

const filterStep2Button = document.getElementById('filterStep2Button');
const filterStep2ButtonTitle = document.getElementById('filterStep2ButtonTitle');

const filterStep3Button = document.getElementById('filterStep3Button');
const filterStep3ButtonTitle = document.getElementById('filterStep3ButtonTitle');

const filterStep4Button = document.getElementById('filterStep4Button');
const filterStep4ButtonTitle = document.getElementById('filterStep4ButtonTitle');

const graphLeftId = '#graphLeft';
const left = 'left';
const graphRightId = '#graphRight';
const right = 'right';

const createGraphsWithMoreNodes = (leftData, rightData, newHeight, data) => {
  clearGraph(graphRightId, right);
  clearGraph(graphLeftId, left);
  const padding = 20;
  if (leftData.transfers > rightData.transfers) {
    const dh = (d3.sum(rightData.links.map(i => i.value + padding)) - padding) / (d3.sum(leftData.links.map(i => i.value + padding)) - padding);
    createGraph(graphLeftId, left, leftData, newHeight, data);
    createGraph(graphRightId, right, rightData, newHeight * dh, data);
  } else {
    const dh = (d3.sum(leftData.links.map(i => i.value + padding)) - padding) / (d3.sum(rightData.links.map(i => i.value + padding)) - padding);
    createGraph(graphRightId, right, rightData, newHeight, data);
    createGraph(graphLeftId, left, leftData, newHeight * dh, data);
  }
}
const createGraphs = (leftData, rightData, data) => {
  clearGraph(graphRightId, right);
  clearGraph(graphLeftId, left);
  signingElement.textContent = leftData.transfers;
  outingElement.textContent = rightData.transfers;

  if (leftData.transfers > rightData.transfers) {
    const dh = rightData.transfers / leftData.transfers;
    createGraph(graphLeftId, left, leftData, height, data);
    createGraph(graphRightId, right, rightData, height * dh, data);
  } else {
    const dh = leftData.transfers / rightData.transfers;
    createGraph(graphRightId, right, rightData, height, data);
    createGraph(graphLeftId, left, leftData, height * dh, data);
  }
}

const showRegionsGraphs = (data, node) => {
  onChangeElement.checked = false;

  // onChangeElement.disabled = true;
  // changeGraphLabelElement.style.opacity = 0.4;

  let defaultHeight = 620;
  filterStep1Button.style.display = 'block';
  filterStep1ButtonTitle.textContent = node.name;

  let newRightData, newLeftData; 
  if (datas.regions && datas.regions[node.name]) {
    newRightData = datas.regions[node.name].right;
    newLeftData = datas.regions[node.name].left;
  } else {
    if (!datas.regions) {
      datas.regions = {};
    }
    newLeftData = filterByCountryToTop(data, node.name);
    newRightData = filterByTopToCountry(data, node.name);
    
    datas.regions[node.name] = {};
    datas.regions[node.name].left = newLeftData;
    datas.regions[node.name].right = newRightData;
  }

  signingElement.textContent = newLeftData.transfers;
  outingElement.textContent = newRightData.transfers;
  signingFromElement.textContent = node.name;
  outingFromElement.textContent = node.name;

  filterStep1Button.dataset.regions = node.name;

  renderGraph(newLeftData, newRightData, data);
  // if (newRightData.nodes.length > 10 || newLeftData.nodes.length > 10) {
  //   defaultHeight = 620 * 2;
  //   createGraphsWithMoreNodes(newLeftData, newRightData, defaultHeight, data);
  // } else {
  //   createGraphs(newLeftData, newRightData, data);
  // } 
}

const showCountriesGraphs = (data, node, firstFilter) => {
  onChangeElement.checked = false;

  // onChangeElement.disabled = true;
  // changeGraphLabelElement.style.opacity = 0.4;

  filterStep2Button.style.display = 'block';
  filterStep2ButtonTitle.textContent = node.name;

  let newRightData, newLeftData; 
  if (datas.countries && datas.countries[node.name]) {
    newRightData = datas.countries[node.name].right;
    newLeftData = datas.countries[node.name].left;
  } else {
    if (!datas.countries) {
      datas.countries = {};
    }
    
    newLeftData = fromCountryFromLeague(data, node.name, firstFilter);
    newRightData = fromLeagueToCountry(data, node.name, firstFilter);

    datas.countries[node.name] = {};
    datas.countries[node.name].left = newLeftData;
    datas.countries[node.name].right = newRightData;
  }

  signingElement.textContent = newLeftData.transfers;
  outingElement.textContent = newRightData.transfers;
  signingFromElement.textContent = node.name;
  outingFromElement.textContent = node.name;

  filterStep2Button.dataset.country = node.name;

  // createGraphs(newLeftData, newRightData, data);
  renderGraph(newLeftData, newRightData, data);
}

const showTeamsGraphs = (data, node, firstFilter, secondFilter) => {
  onChangeElement.checked = false;

  // onChangeElement.disabled = true;
  // changeGraphLabelElement.style.opacity = 0.4;

  let defaultHeight = 620;
  filterStep3Button.style.display = 'block';
  filterStep3ButtonTitle.textContent = node.name;

  let newRightData, newLeftData; 
  if (datas.teams && datas.teams[node.name]) {
    newRightData = datas.teams[node.name].right;
    newLeftData = datas.teams[node.name].left;
  } else {
    if (!datas.teams) {
      datas.teams = {};
    }

    newLeftData = fromLeagueToTeams(data, node.name, firstFilter, secondFilter);
    newRightData = fromLeagueToTeamsOut(data, node.name, firstFilter, secondFilter);

    datas.teams[node.name] = {};
    datas.teams[node.name].left = newLeftData;
    datas.teams[node.name].right = newRightData;
  }

  signingElement.textContent = newLeftData.transfers;
  outingElement.textContent = newRightData.transfers;
  signingFromElement.textContent = node.name;
  outingFromElement.textContent = node.name;

  filterStep3Button.dataset.regions = node.name;

  renderGraph(newLeftData, newRightData, data);
  // if (newRightData.nodes.length > 10 || newLeftData.nodes.length > 10) {
  //   defaultHeight = 620 * 2;
  //   createGraphsWithMoreNodes(newLeftData, newRightData, defaultHeight, data);
  // } else {
  //   createGraphs(newLeftData, newRightData, data);
  // }
}
const showFootbollmanGraphs = (data, node, firstFilter, secondFilter, thirdFilter) => {
  onChangeElement.checked = false;

  // onChangeElement.disabled = true;
  // changeGraphLabelElement.style.opacity = 0.4;

  // let defaultHeight = 620;
  filterStep4Button.style.display = 'block';
  filterStep4ButtonTitle.textContent = node.name;

  let newRightData, newLeftData; 
  if (datas.teams && datas.teams[node.name]) {
    newRightData = datas.teams[node.name].right;
    newLeftData = datas.teams[node.name].left;
  } else {
    if (!datas.teams) {
      datas.teams = {};
    }

    newLeftData = fromTeamsToFootballmans(data, node.name, firstFilter, secondFilter, thirdFilter);
    newRightData = fromTeamsToFootballmansOut(data, node.name, firstFilter, secondFilter, thirdFilter)

    datas.teams[node.name] = {};
    datas.teams[node.name].left = newLeftData;
    datas.teams[node.name].right = newRightData;
  }

  signingElement.textContent = newLeftData.transfers;
  outingElement.textContent = newRightData.transfers;
  signingFromElement.textContent = node.name;
  outingFromElement.textContent = node.name;

  filterStep4Button.dataset.regions = node.name;

  renderGraph(newLeftData, newRightData, data);
}

const showByLeagues = (leftData, rightData, data) => {
  renderGraph(leftData, rightData, data);
  // let defaultHeight = 620;
  // if (rightData.nodes.length > 10 || leftData.nodes.length > 10) {
  //   defaultHeight = 620 * 2;
  //   createGraphsWithMoreNodes(leftData, rightData, defaultHeight, data);
  // } else {
  //   createGraphs(leftData, rightData, data);
  // } 
}

const getAllLeagues = (data) => {
  const l = {};
  data.reduce((prev, curr, i) => {
    if (!l[curr[fromLeagueField]]) {
      l[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      l[curr[fromLeagueField]].value += 1;
    }
    if (!l[curr[toLeagueField]]) {
      l[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
    } else {
      l[curr[toLeagueField]].value += 1;
    }
  }, l);
  return Object.keys(l);
}

const getAllTeams = (data) => {
  const l = {};
  data.reduce((prev, curr, i) => {
    if (!l[curr[fromTeamField]]) {
      l[curr[fromTeamField]] = {value: 1, title: curr[fromTeamField]}
    } else {
      l[curr[fromTeamField]].value += 1;
    }
    if (!l[curr[toTeamField]]) {
      l[curr[toTeamField]] = {value: 1, title: curr[toTeamField]}
    } else {
      l[curr[toTeamField]].value += 1;
    }
  }, l);
  return Object.keys(l);
}

const renderGraph = (leftData, rightData, data) => {
  clearGraph(graphRightId, right);
  clearGraph(graphLeftId, left);

  const maxDefaultHeight = 780;
  let n = 1;
  
  const padding = 20;
  const dhL = leftData.nodes.filter(n => !n.root).length * padding;
  let leftHeight = leftData.transfers / n + dhL;
  const dhR = rightData.nodes.filter(n => !n.root).length * padding;
  let rightHeight = rightData.transfers / n + dhR;

  const max = Math.max(leftHeight, rightHeight);
  
  if (max >= 780) {
    n = 4;
    leftHeight = leftData.transfers / n + dhL;
    rightHeight = rightData.transfers / n + dhR;
  } 
  // else if (max <= 100 && (leftData.nodes.length > 5 || rightData.nodes.length > 5)) {
  //   n = 0.05;
  //   leftHeight = leftData.transfers / n + dhL;
  //   rightHeight = rightData.transfers / n + dhR;
  // }
  else if (max <= 300) {
    n = 0.25;
    leftHeight = leftData.transfers / n + dhL;
    rightHeight = rightData.transfers / n + dhR;
  }

  createGraph(graphLeftId, left, leftData, leftHeight, data);
  createGraph(graphRightId, right, rightData, rightHeight, data);
}

const datas = {};
console.log(datas);
let leaguesKey = [];
let teamsKey = [];
let firstFilter = null;
let secondFilter = null;
let thirdFilter = null;
let fourthFilter = null;

// test color
// const color = d3.scaleOrdinal(d3.schemePaired);
const getCsv = async () => {
  const data = await d3.csv('./football-transfers.csv');
  console.log(data);

  leaguesKey = getAllLeagues(data);
  teamsKey = getAllTeams(data);

  const leftData = toTopInInside(data);
  const rightData = fromTopOutInside(data);

  datas.top = {};
  datas.top.left = leftData;
  datas.top.right = rightData;

  // createGraphs(leftData, rightData, data);
  signingElement.textContent = leftData.transfers;
  outingElement.textContent = rightData.transfers;

  renderGraph(leftData, rightData, data);

  setPointData(data);

  onChangeElement.addEventListener('change', (e) => {
    
    if (!firstFilter) {
      filterStep1Button.style.display = 'none';
      if (e.target.checked) {
        const nextLeftData = fromRegionInInsideToLegueTop(data);
        const nextRightData = fromLeagueTopOutInsideToRegion(data);
        // createGraphs(nextLeftData, nextRightData, data);
        renderGraph(nextLeftData, nextRightData, data);
      } else {
        // createGraphs(leftData, rightData, data);
        renderGraph(leftData, rightData, data);
      }
    } else if (fourthFilter) {
      // console.log({fourthFilter});
      if (e.target.checked) {
        const nextLeftData = fromFootballmans(data, fourthFilter, thirdFilter, secondFilter, firstFilter);
        const nextRightData = toFootballmans(data, fourthFilter, thirdFilter, secondFilter, firstFilter);
        
        renderGraph(nextLeftData, nextRightData, data);
      } else {
        showFootbollmanGraphs(data, {name: fourthFilter}, firstFilter, secondFilter, thirdFilter);
      }
    } else if (thirdFilter) {
      // console.log({thirdFilter});
      if (e.target.checked) {
        const nextLeftData = fromTeams(data, thirdFilter, secondFilter, firstFilter);
        const nextRightData = toTeams(data, thirdFilter, secondFilter, firstFilter);
        showByLeagues(nextLeftData, nextRightData, data);
      } else {
        showTeamsGraphs(data, {name: thirdFilter}, firstFilter, secondFilter);
      }
    } else if (secondFilter) {
      // console.log({secondFilter});
      if (e.target.checked) {
        const nextLeftData = fromLegues(data, secondFilter, firstFilter);
        const nextRightData = toLeagues(data, secondFilter, firstFilter);
        showByLeagues(nextLeftData, nextRightData, data);
      } else {
        showCountriesGraphs(data, {name: secondFilter}, firstFilter);
      }
    } else if (firstFilter) {
      // console.log({firstFilter});
      if (e.target.checked) {
        const nextLeftData = fromCountries(data, firstFilter);
        const nextRightData = toCountries(data, firstFilter);
        showByLeagues(nextLeftData, nextRightData, data);
      } else {
        showRegionsGraphs(data, {name: firstFilter});
      }
    }
    
  });

  filterStep1Button.addEventListener('click', () => {
    createGraphs(datas.top.left, datas.top.right, data);
    onChangeElement.disabled = false;
    changeGraphLabelElement.style.opacity = 1;
    filterStep1Button.style.display = 'none';
    filterStep2Button.style.display = 'none';
    filterStep3Button.style.display = 'none';
    filterStep4Button.style.display = 'none';

    firstFilter = null;
    secondFilter = null;
    thirdFilter = null;
    
    setPointData(data);
  });

  filterStep2Button.addEventListener('click', () => {
    showRegionsGraphs(data, {name: filterStep1Button.dataset.regions});
    onChangeElement.disabled = false;
    changeGraphLabelElement.style.opacity = 1;
    filterStep2Button.style.display = 'none';
    filterStep3Button.style.display = 'none';
    filterStep4Button.style.display = 'none';

    secondFilter = null;
    thirdFilter = null;

    setPointData(data, firstFilter);
  });

  filterStep3Button.addEventListener('click', () => {
    showCountriesGraphs(data, {name: secondFilter}, firstFilter);
    onChangeElement.disabled = false;
    changeGraphLabelElement.style.opacity = 1;
    filterStep3Button.style.display = 'none';
    filterStep4Button.style.display = 'none';

    thirdFilter = null;
  });

  filterStep4Button.addEventListener('click', () => {
    showTeamsGraphs(data, {name: thirdFilter}, firstFilter, secondFilter);
    onChangeElement.disabled = false;
    changeGraphLabelElement.style.opacity = 1;
    filterStep4Button.style.display = 'none';

    fourthFilter = null;
  });
}

getCsv();

const clearGraph = (id, type) => {
  const el = document.querySelector(id);
  el.innerHTML = '';
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
  // test color
  // const gradient = link.append("linearGradient")
  //   .attr("id", d => {
  //     return `${d.index}Link`;
  //   })
  //   .attr("gradientUnits", "userSpaceOnUse")
  //   .attr("x1", d => d.source.x1)
  //   .attr("x2", d => d.target.x0);
  // gradient.append("stop")
  //   .attr("offset", "0%")
  //   .attr("stop-color", d => color(d.source.name));
  // gradient.append("stop")
  //   .attr("offset", "100%")
  //   .attr("stop-color", d => color(d.target.name));

  link.append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke-width", d => Math.max(1, d.width))
    // test color
    // .attr("stroke", d => `url(#${d.index}Link)`)
    .style("cursor", "pointer")
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
      .style("width", "200px")
      .style("position", "absolute")
      .style("line-height", d => {
        if (d.value < 10) {
          return "12px";
        }
        return "14px";
      })
      .style("font-size", d => {
        if (d.value < 10) {
          return "12px";
        }
        return "16px";
      })
      .style("top", d => {
        if (d.root && d.isLeagues) {
          return `${(d.y0 + d.y1) / 2}px`;
        } else {
          return `${d.y0 + 8}px`;
        }
      })
      .style("left", d => {
        if (type === 'left') {
          if (d.root && d.isLeagues) {
            return `${370}px`;
          } else if (d.root) {
            return `${d.x0 - 200}px`;
          } else {
            return `${d.x0 - 200}px`;
          }
        } else {
          if (d.root && d.isLeagues) {
            return `${10}px`;
          } else if (d.root) {
            return `${d.x0 + 100}px`;
          } else {
            return `${d.x0 + 40}px`;
          }
        }
      })
      .style("text-align", d => {
        if (type === 'left') {
          if (d.root && d.isLeagues) {
            return ``;
          } else if (d.root) {
            return ``;
          } else {
            return `right`;
          }
        } else {
          if (d.root && d.isLeagues) {
            return ``;
          } else if (d.root) {
            return ``;
          } else {
            return ``;
          }
        }
      })
      .on("click", (e, d) => {
        if (!d.root) {
          if (regionsOrder.includes(d.name)) {
            firstFilter = d.name;
            showRegionsGraphs(data, d);
            setPointData(data, firstFilter);
          } else if (countries.has(d.name)) {
            secondFilter = d.name;
            showCountriesGraphs(data, d, firstFilter);
            setPointData(data, firstFilter, secondFilter);
          } else if (leaguesKey.includes(d.name)) {
            thirdFilter = d.name;
            showTeamsGraphs(data, d, firstFilter, secondFilter);
          } else if (teamsKey.includes(d.name)) {
            fourthFilter = d.name;
            showFootbollmanGraphs(data, d, firstFilter, secondFilter, thirdFilter);
          }
      }
      })
      .style('pointer-events', d => {
        if (d.root && d.isLeagues) {
          return 'none';
        }
      })
      // .text(d => d.name);
      .text(d => {
        if (d.root) {
          if (d.isLeagues) {
            const icon = d.name.split(' ');
            return icon[icon.length - 1];
          }
          return '';
        } else {
          return d.name;
        }
      });
    
      
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


