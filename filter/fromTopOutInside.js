import { fromRegionField, region, toRegionField } from "../fields";
import { regionsOrder } from "../order";

export const fromTopOutInside = (data) => {

  const fromTopRegions = data.filter(d => d[fromRegionField] === region);
  const transfers = fromTopRegions.length;

  const regions = {};
  fromTopRegions.reduce((prev, curr, i) => {
    if (!regions[curr[toRegionField]]) {
      regions[curr[toRegionField]] = {value: 1, title: curr[toRegionField]}
    } else {
      regions[curr[toRegionField]].value += 1;
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
        source: 0,
        target: regions[key].index,
        value: regions[key].value,
      });
    }
  });
  return {nodes, links, transfers};
}