import { fromRegionField, inType, insideType, region, toLeagueField, toRegionField, typeField } from "../fields";
import { leaguesOrder, regionsOrder } from "../order";

export const fromRegionInInsideToLegueTop = (data) => {

  const regions = {};
  data.reduce((prev, curr, i) => {
    if (!regions[curr[fromRegionField]]) {
      regions[curr[fromRegionField]] = {value: 1, title: curr[fromRegionField]}
    } else {
      regions[curr[fromRegionField]].value += 1;
    }
  }, regions);

  const nodes = [];
  const links = [];
  let transfers = 0;

  regionsOrder.forEach(key => {
    const fromRegions = data.filter(d => 
      (d[typeField] === insideType || d[typeField] === inType) 
      && d[fromRegionField] === key 
      && d[toRegionField] === region
    );
    if (fromRegions.length > 0) {
      transfers += fromRegions.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key,
      });

      const leagues = {};
      fromRegions.reduce((prev, curr, i) => {
        if (!leagues[curr[toLeagueField]]) {
          leagues[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
        } else {
          leagues[curr[toLeagueField]].value += 1;
        }
      }, leagues);

      leaguesOrder.forEach(key => {
        if (!nodes.find(n => n.name === key.title)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key.title,
            root: true,
            isLeagues: true,
          });
        }
      });

      leaguesOrder.forEach(key => {
        const node = nodes.find(n => n.name === key.title);
        if (node && leagues[key.key]) {
          links.push({
            source: index,
            target: node.node,
            value: leagues[key.key].value,
            data: {type: 'left', originName: key.key}
          });
        }
      });
    }
  });
  
  return {nodes, links, transfers};
}