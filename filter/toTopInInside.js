import { fromRegionField, region, toRegionField } from "../fields";
import { regionsOrder } from "../order";

export const toTopInInside = (data) => {

  const toTopRegions = data.filter(d => d[toRegionField] === region);
  const transfers = toTopRegions.length;

  const regions = {};
  toTopRegions.reduce((prev, curr, i) => {
    if (!regions[curr[fromRegionField]]) {
      regions[curr[fromRegionField]] = {value: 1, title: curr[fromRegionField]}
    } else {
      regions[curr[fromRegionField]].value += 1;
    }
  }, regions);

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  regionsOrder.forEach(key => {
    if (regions[key]) {
      const index = nodes.length;
      regions[key].index = index;
      nodes.push({
        node: index,
        name: regions[key].title,
      });
    }
  });

  regionsOrder.forEach(key => {
    if (regions[key]) {
      links.push({
        source: regions[key].index,
        target: 0,
        value: regions[key].value,
        data: {type: 'left'}
      });
    }
  });

  return {nodes, links, transfers};
}