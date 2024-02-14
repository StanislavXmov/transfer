import * as d3 from 'd3';
import { feeField, fromCountryField, fromLeagueField, fromRegionField, fromTeamField, inType, insideType, marketValueField, outType, playerField, region, toCountryField, toLeagueField, toRegionField, toTeamField, typeField } from './fields';

export const colors = {
  'Top': '#FEFEFE',
  'Europe, ex. Top Leagues': '#1FB35F',
  'Asia': '#F051AE',
  'South America': '#FEB74F',
  'North America': '#55AFE1',
  'Africa': '#FD3A34',
  'No club': '#C1C1C1',
  'Retired': '#C1C1C1',
};
const container = document.getElementById('transferContainer');
const axisYTop = document.getElementById('axisYTop');
const axisYTopBorder = document.getElementById('axisYTopBorder');
// const axisYBottom = document.getElementById('axisYBottom');
// const axisYBottomBorder = document.getElementById('axisYBottomBorder');
const axisX = document.getElementById('axisX');
const clientWidth = container.clientWidth;
const transferInfo = document.getElementById('transferInfo');
// const info = document.getElementById('info');
const name = document.getElementById('name');
const fromTeam = document.getElementById('fromTeam');
const age = document.getElementById('age');
const fromLeague = document.getElementById('fromLeague');
const fromCountry = document.getElementById('fromCountry');
const toTeam = document.getElementById('toTeam');
const toLeague = document.getElementById('toLeague');
const toCountry = document.getElementById('toCountry');
const marketValue = document.getElementById('marketValue');
const fee = document.getElementById('fee');

const axisData = [0, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
const axisDataY = [50_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
const axisDataString = {
  "0": "0",
  "10000": "10k",
  "50000": "50k",
  "100000": "100k",
  "1000000": "1M",
  "10000000": "10M",
  "100000000": "100M",
  "1000000000": "1B",
}
// min 45;
// const axisStep = 75;
const axisStepY = Math.min(Math.round(clientWidth / 7), 80);
const axisStep = Math.min(Math.round(clientWidth / 7), 100);
const paddingLeft = 32;
const dy = axisStep * 1.65;

const width = (axisData.length - 1) * axisStep + axisStep;
const height = (axisData.length - 1) * axisStepY + axisStepY;

axisYTop.style.top = `${axisStepY * 2.5}px`;
axisYTopBorder.style.top = `${axisStepY * 2.5}px`;
axisYTopBorder.style.width = `${axisStepY * 4.5}px`;
// axisX.style.top = `${axisStepY * 5 + 6}px`;
axisX.style.top = `${height - axisStepY / 4 - dy + 3}px`;
axisX.style.left = `${axisStep * 5 + axisStep / 2}px`;

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
});

axisDataY.forEach((step, i) => {
  if (!axisDataY[i + 1]) {
    return;
  }

  axis.y[step] = d3.scaleLinear()
    .domain([step, axisDataY[i + 1]])
    .range([height - (i * axisStepY),height - (i + 1) * axisStepY]);
});

const svg = d3.select('#transferContainer').append("svg")
  .attr("width", width)
  .attr("height", axisStepY * 5 + 10)
  .attr("viewBox", [0, 0, width, axisStepY * 5])
  // .attr("height", 900 + 10)
  // .attr("viewBox", [0, 0, width, 900])
  // .attr("style", "max-width: 100%; height: auto;");

Object.keys(axis.x).forEach(key => {
  if (Number(key) === axisData[axisData.length - 2]) {
    return;
  }
  svg.append("g")
    .attr("transform", `translate(${paddingLeft},${height - axisStepY / 4 - dy })`)
    .attr("class", `domainX`)
    .call(d3.axisBottom(axis.x[key]).ticks(1).tickFormat((d => `${axisDataString[d]}`)))
    .call(g => g.select(".domain").remove());
});

svg.selectAll('.domainX')
  .selectAll("line").remove();

Object.keys(axis.y).forEach(key => {
  if (Number(key) === axisData[axisData.length - 2]) {
    return;
  }
  svg.append("g")
    .attr("transform", `translate(${paddingLeft}, ${- axisStep / 4  - dy - 20 })`)
    .call(d3.axisLeft(axis.y[key]).ticks(1).tickFormat((d => `${axisDataString[d]}`)))
    .call(g => g.select(".domain").remove());
});

axis.y[0] = d3.scaleLinear()
.domain([0, 50000])
.range([height - (0 * axisStep),height - (0 + 1) * axisStep]);

const getX = (d) => {
  for (let j = axisData.length - 1; j >= 0; j--) {
    const x = axisData[j - 1];
    const v = Number(d[marketValueField].split(',').join(''));
    if (v >= x) {
      return axis.x[x];
    }
  }
}

let yInState = {};
let yInStatePL = {};
let yInStatePR = {};
let yInStatePC = {};

let yOutState = {};
let yOutStatePL = {};
let yOutStatePR = {};
let yOutStatePC = {};

const getMarketValue = (v) => Number(v.split(',').join(''));

const setState = (d, state) => {
  if (d[feeField] === '0' || d[feeField] === '?') {
    if (state[Number(d[marketValueField].split(',').join(''))]) {
      state[Number(d[marketValueField].split(',').join(''))] += 1; 
    } else {
      state[Number(d[marketValueField].split(',').join(''))] = 1;
    }
  }
}

const getY = (d) => {
  if (d[feeField] == 0) {
    return axis.y['0'];
  }
  for (let j = axisDataY.length - 1; j >= 0; j--) {
    let y = axisDataY[j - 1];
    if (d[feeField] === '?') {
      return axis.y['0'];
    }
    if (d[feeField] >= y) {
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

let dataState = [];
let dataFeeState = [];
let selected = '-1';

export const getPointsData = () => dataState;

const circleOver = (e) => {
  if (e.target.dataset.index && selected !== e.target.dataset.index) {
    selected = e.target.dataset.index;
    const d = dataState[Number(e.target.dataset.index)];
    if (d) {
      transferInfo.style.display = 'block';
      if (document.body.clientWidth <= 1200) {
        transferInfo.style.left = `${Number(e.target.dataset.left) + 10}px`;
        transferInfo.style.top = `${Number(e.target.dataset.top)}px`
        // transferInfo.style.left = `${e.target.cx.baseVal.value + 10}px`;
        // transferInfo.style.top = `${e.target.cy.baseVal.value}px`;
      } else {
        transferInfo.style.width = `320px`;
        transferInfo.style.left = `${Number(e.target.dataset.left) - 330}px`;
        transferInfo.style.top = `${Number(e.target.dataset.top)}px`;
        // transferInfo.style.left = `${e.target.cx.baseVal.value - 330}px`;
        // transferInfo.style.top = `${e.target.cy.baseVal.value}px`;
      }
      
      // info.textContent = JSON.stringify(d);
      name.textContent = d[playerField];
      age.textContent = d['Age'];
      fromTeam.textContent = d[fromTeamField];
      fromLeague.textContent = d[fromLeagueField];
      fromCountry.textContent = d[fromCountryField];
      toTeam.textContent = d[toTeamField];
      toLeague.textContent = d[toLeagueField];
      toCountry.textContent = d[toCountryField];
      marketValue.textContent = Number(d[marketValueField].split(',').join('')).toLocaleString();
      fee.textContent = Number(d[feeField]).toLocaleString();
    }
  }
}

const feeCircleOver = (e) => {
  if (e.target.dataset.index && selected !== e.target.dataset.index) {
    selected = e.target.dataset.index;
    const d = dataFeeState[Number(e.target.dataset.index)];
    if (d) {
      transferInfo.style.display = 'block';
      if (document.body.clientWidth <= 1200) {
        transferInfo.style.left = `${Number(e.target.dataset.left) + 10}px`;
        transferInfo.style.top = `${Number(e.target.dataset.top) + axisStepY * 5 - 6}px`
      } else {
        transferInfo.style.width = `320px`;
        transferInfo.style.left = `${Number(e.target.dataset.left) - 330}px`;
        transferInfo.style.top = `${Number(e.target.dataset.top) + axisStepY * 5 - 6}px`;
      }
      
      name.textContent = d[playerField];
      age.textContent = d['Age'];
      fromTeam.textContent = d[fromTeamField];
      fromLeague.textContent = d[fromLeagueField];
      fromCountry.textContent = d[fromCountryField];
      toTeam.textContent = d[toTeamField];
      toLeague.textContent = d[toLeagueField];
      toCountry.textContent = d[toCountryField];
      marketValue.textContent = Number(d[marketValueField].split(',').join('')).toLocaleString();
      fee.textContent = Number(d[feeField]).toLocaleString();
    }
  }
}

const circleOut = (e) => {
  transferInfo.style.display = 'none';
  selected = '-1';
}

const d1 = "M0 3C0 4.65685 1.34315 6 3 6V0C1.34315 0 0 1.34315 0 3Z";
const d2 = "M3 6C4.65685 6 6 4.65685 6 3C6 1.34315 4.65685 0 3 0V6Z";

const createPoints = (data) => {
  
  svg.append("g")
    .attr("id", "group1")
    .selectAll()
    .data(data)
    .join("g")
      .on('mouseover', circleOver)
      .on('mouseout', circleOut)
      .style("cursor", "pointer")
      // .attr("data-index", (d, i) => i)
      // .attr("data-left", d => getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3)
      // .attr("data-top", d => {
      //   if (d[feeField] === '0' || d[feeField] === '?') {
      //     const n = yState[Number(d[marketValueField].split(',').join(''))];
      //     return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy + 20 + n * 3
      //   }
        
      //   return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy;
      // })
      .attr("transform", d => {
        if (d[feeField] === '0' || d[feeField] === '?') {
          // setYState(d);
          // const n = yState[Number(d[marketValueField].split(',').join(''))];
          // return `
          //   translate(
          //     ${getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3}, 
          //     ${getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy + 20 + n * 3 + 10})
          //   `;
          return null;
        }
        return `
        translate(
          ${getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3}, 
          ${getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20})
        `})
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3.5)
      .attr("stroke", "#00000060")
      .attr("fill", "none")
      .attr("data-index", (d, i) => i)
      .attr("data-left", d => getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3)
      // .attr("data-top", d => getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy)
      .attr("data-top", d => {
        if (d[feeField] === '0' || d[feeField] === '?') {
          // setYStatePL(d);
          // const n = yStatePL[Number(d[marketValueField].split(',').join(''))];
          // return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy + 20 + n * 3
          return null;
        }
        
        return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20;
      })
      .select(function() { return this.parentNode; })
      .append("path")
        .attr("d", d1)
        .attr("fill", d => getFromColor(d))
        .attr("data-index", (d, i) => i)
        .attr("data-left", d => getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3)
        // .attr("data-top", d => getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy)
        .attr("data-top", d => {
          if (d[feeField] === '0' || d[feeField] === '?') {
            // setYStatePR(d);
            // const n = yStatePR[Number(d[marketValueField].split(',').join(''))];
            // return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy + 20 + n * 3
            return null;
          }
          
          return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20;
        })
        .select(function() { return this.parentNode; })
        .append("path")
        .attr("d", d2)
        .attr("fill", d => getToColor(d))
        .attr("data-index", (d, i) => i)
        .attr("data-left", d => getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3)
        // .attr("data-top", d => getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy);
        .attr("data-top", d => {
          if (d[feeField] === '0' || d[feeField] === '?') {
            // setYStatePC(d);
            // const n = yStatePC[Number(d[marketValueField].split(',').join(''))];
            // return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy + 20 + n * 3
            return null;
          }
          
          return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20;
        });

    // const maxh = Math.max(...Object.values(yState)) * 3;
    // axisYBottom.style.top = `${axisStep * 5 + maxh}px`;
    // axisYBottom.style.top = `${axisStep * 6}px`;

    // axisYBottomBorder.style.top = `${axisStep * 5 + 38}px`;
    // axisYBottomBorder.style.width = `${maxh + 24}px`;
}

const createFeePoints = (data) => {
  const inDataState = {};
  const outDataState = {};
  const inData = data.filter(t => t[typeField] === inType);
  const outData = data.filter(t => t[typeField] === outType);
  inData.forEach(t => {
    if (inDataState[getMarketValue(t[marketValueField])]) {
      inDataState[getMarketValue(t[marketValueField])] += 1;
    } else {
      inDataState[getMarketValue(t[marketValueField])] = 1;
    }
  });
  outData.forEach(t => {
    if (outDataState[getMarketValue(t[marketValueField])]) {
      outDataState[getMarketValue(t[marketValueField])] += 1;
    } else {
      outDataState[getMarketValue(t[marketValueField])] = 1;
    }
  });

  const maxhIn = Math.max(...Object.values(inDataState)) * 3;
  const maxhOut = Math.max(...Object.values(outDataState)) * 3;
  const height = Math.max(maxhIn * 2, maxhOut * 2) + 24;

  let svg = null;
  if (!document.getElementById('feePoints')) {
    svg = d3.select('#transferContainer').append("svg")
      .attr("class", 'feePoints')
      .attr("id", 'feePoints')
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
  } else {
    svg = d3.select('#feePoints');
  }

  yInState = {};
  yInStatePL = {};
  yInStatePR = {};
  yInStatePC = {};

  yOutState = {};
  yOutStatePL = {};
  yOutStatePR = {};
  yOutStatePC = {};

  svg.append("g")
    .attr("id", "group2")
    .selectAll()
    .data(data)
    .join("g")
      .on('mouseover', feeCircleOver)
      .on('mouseout', circleOut)
      .style("cursor", "pointer")
      .attr("transform", d => {
        const x = getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3;
        let y = 0;
        if (d[typeField] === insideType || d[typeField] === inType) {
          setState(d, yInState);
          const n = yInState[getMarketValue(d[marketValueField])];
          y = height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) - n * 3 - 3;
        } else {
          setState(d, yOutState);
          const n = yOutState[getMarketValue(d[marketValueField])];
          y = height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) + n * 3 + 3;
        }
        return `
          translate(
            ${x},
            ${y})
        `;
        })
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3.5)
      .attr("stroke", "#00000060")
      .attr("fill", "none")
      .attr("data-index", (d, i) => i)
      .attr("data-left", d => getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3)
      .attr("data-top", d => {
        if (d[typeField] === insideType || d[typeField] === inType) {
          setState(d, yInStatePL);
          const n = yInStatePL[getMarketValue(d[marketValueField])];
          return height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) - n * 3 - 3;
        } else {
          setState(d, yOutStatePL);
          const n = yOutStatePL[getMarketValue(d[marketValueField])];
          return height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) + n * 3 + 3;
        }
      })
      .select(function() { return this.parentNode; })
      .append("path")
        .attr("d", d1)
        .attr("fill", d => getFromColor(d))
        .attr("data-index", (d, i) => i)
        .attr("data-left", d => getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3)
        // .attr("data-top", d => getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy)
        .attr("data-top", d => {
          if (d[typeField] === insideType || d[typeField] === inType) {
            setState(d, yInStatePR);
            const n = yInStatePR[getMarketValue(d[marketValueField])];
            return height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) - n * 3 - 3;
          } else {
            setState(d, yOutStatePR);
            const n = yOutStatePR[getMarketValue(d[marketValueField])];
            return height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) + n * 3 + 3;
          }
        })
        .select(function() { return this.parentNode; })
        .append("path")
        .attr("d", d2)
        .attr("fill", d => getToColor(d))
        .attr("data-index", (d, i) => i)
        .attr("data-left", d => getX(d)(Number(d[marketValueField].split(',').join(''))) + paddingLeft - 3)
        .attr("data-top", d => {
            if (d[typeField] === insideType || d[typeField] === inType) {
              setState(d, yInStatePC);
              const n = yInStatePC[getMarketValue(d[marketValueField])];
              return height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) - n * 3 - 3;
            } else {
              setState(d, yOutStatePC);
              const n = yOutStatePC[getMarketValue(d[marketValueField])];
              return height / 2 + Number(d[feeField] === '?' ? 0 : d[feeField]) + n * 3 + 3;
            }
        });
}

const clearGraph = () => {
  // #transferContainer
  const group1 = document.querySelector('#group1');
  const group2 = document.querySelector('#group2');
  group1 && group1.remove();
  group2 && group2.remove();
}

export const setPointData = (data, firstFilter, secondFilter, thirdFilter, fourthFilter) => {
  clearGraph();

  let filtered = [];
  // console.log({firstFilter, secondFilter, thirdFilter, fourthFilter});

  if (firstFilter && secondFilter && thirdFilter && fourthFilter) {
    const filteredByType = data.filter(d => 
      d[typeField] === inType || d[typeField] === insideType || d[typeField] === outType);
    if (firstFilter === region) {
      filtered = filteredByType.filter(d => 
        (d[fromCountryField] === secondFilter
        && d[fromRegionField] === region
        && d[toRegionField] === region 
        && d[fromLeagueField] === thirdFilter
        && d[fromTeamField] === fourthFilter) ||
        (d[toRegionField] === firstFilter
        && d[fromRegionField] === region 
        && d[toCountryField] === secondFilter 
        && d[toLeagueField] === thirdFilter
        && d[toTeamField] === fourthFilter)
      );
    } else {
      filtered = filteredByType.filter(d => 
        (d[fromCountryField] === secondFilter 
        && d[toRegionField] === region 
        && d[fromRegionField] !== region
        && d[fromLeagueField] === thirdFilter
        && d[fromTeamField] === fourthFilter) ||
        (d[toRegionField] === firstFilter
        && d[toCountryField] === secondFilter 
        && d[toLeagueField] === thirdFilter
        && d[toTeamField] === fourthFilter)
      );
    }

    // console.log(filtered.length);
    dataFeeState = filtered.filter(t => t[feeField] === '0' || t[feeField] === '?');
    filtered = filtered.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
    dataState = filtered;
    dataState = dataState.map((d, i) => ({...d, i}));
    createPoints(filtered);
    createFeePoints(dataFeeState);
  } else if (firstFilter && secondFilter && thirdFilter) {
    const filteredByType = data.filter(d => 
      d[typeField] === inType || d[typeField] === insideType || d[typeField] === outType);
    if (firstFilter === region) {
      const filteredByRegions = filteredByType.filter(d => 
        d[fromRegionField] === region 
        && d[toRegionField] === region
      );

      filtered = filteredByRegions.filter(d => 
        (d[fromCountryField] === secondFilter && d[fromLeagueField] === thirdFilter ) ||
        (d[toCountryField] === secondFilter && d[toLeagueField] === thirdFilter)
      );
    } else {
      filtered = filteredByType.filter(d => 
        (d[fromCountryField] === secondFilter 
        && d[toRegionField] === region 
        && d[fromRegionField] !== region
        && d[fromLeagueField] === thirdFilter) ||
        (d[toCountryField] === secondFilter 
        && d[toRegionField] === firstFilter 
        && d[toLeagueField] === thirdFilter)
      );
    }
    // console.log(filtered.length);
    dataFeeState = filtered.filter(t => t[feeField] === '0' || t[feeField] === '?');
    filtered = filtered.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
    dataState = filtered;
    dataState = dataState.map((d, i) => ({...d, i}));
    createPoints(filtered);
    createFeePoints(dataFeeState);
  } else if (firstFilter && secondFilter) {
    const filteredByType = data.filter(d => 
      d[typeField] === inType || d[typeField] === insideType || d[typeField] === outType);
    if (firstFilter === region) {
      const filteredByRegions = filteredByType.filter(d => 
        d[fromRegionField] === region 
        && d[toRegionField] === region
      );
      filtered = filteredByRegions.filter(d => 
        d[fromCountryField] === secondFilter ||
        d[toCountryField] === secondFilter
      );
    } else {
      filtered = filteredByType.filter(d => 
        (d[fromCountryField] === secondFilter 
        && d[toRegionField] === region 
        && d[fromRegionField] !== region) ||
        (d[toCountryField] === secondFilter 
        && d[toRegionField] === firstFilter 
        // && d[fromRegionField] !== region
        )
      );
    }
    // console.log(filtered.length);
    dataFeeState = filtered.filter(t => t[feeField] === '0' || t[feeField] === '?');
    filtered = filtered.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
    dataState = filtered;
    dataState = dataState.map((d, i) => ({...d, i}));
    createPoints(filtered);
    createFeePoints(dataFeeState);
  } else if (firstFilter) {

    const filteredByType = data.filter(d => 
      d[typeField] === inType || d[typeField] === insideType || d[typeField] === outType);
    filtered = filteredByType.filter(d => 
      (d[fromRegionField] === region && 
      d[toRegionField] === firstFilter) ||
      (d[toRegionField] === region && 
      d[fromRegionField] === firstFilter)
    );
    // console.log(filtered.length);
    dataFeeState = filtered.filter(t => t[feeField] === '0' || t[feeField] === '?');
    filtered = filtered.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
    dataState = filtered;
    dataState = dataState.map((d, i) => ({...d, i}));
    createPoints(filtered);
    createFeePoints(dataFeeState);
  } else {
    
    filtered = data.filter(d => 
      d[fromRegionField] === region ||
      d[toRegionField] === region
    );

    // console.log(filtered.length);
    dataFeeState = filtered.filter(t => t[feeField] === '0' || t[feeField] === '?');
    console.log({dataFeeState});
    filtered = filtered.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
    dataState = filtered;
    dataState = dataState.map((d, i) => ({...d, i}));
    createPoints(filtered);
    createFeePoints(dataFeeState);
  }
}

