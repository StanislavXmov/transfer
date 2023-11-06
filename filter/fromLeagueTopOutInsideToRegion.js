import { fromLeagueField, insideType, outType, toRegionField, typeField } from "../fields";
import { leaguesOrder, regionsOrder } from "../order";

export const fromLeagueTopOutInsideToRegion = (data) => {

  const leagues = {};
  data.reduce((prev, curr, i) => {
    if (!leagues[curr[fromLeagueField]]) {
      leagues[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      leagues[curr[fromLeagueField]].value += 1;
    }
  }, leagues);

  const nodes = [];
  const links = [];
  let transfers = 0;

  leaguesOrder.forEach(key => {
    const fromLeagues = data.filter(
      d => 
        (d[typeField] === insideType || d[typeField] === outType) && 
        d[fromLeagueField] === key.key
    );
    if (fromLeagues.length > 0) {
      transfers += fromLeagues.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key.title,
        root: true,
        isLeagues: true,
      });
      const regions = {};
      fromLeagues.reduce((prev, curr, i) => {
        if (!regions[curr[toRegionField]]) {
          regions[curr[toRegionField]] = {value: 1, title: curr[toRegionField]}
        } else {
          regions[curr[toRegionField]].value += 1;
        }
      }, regions);
      
      regionsOrder.forEach(key => {
        if (!nodes.find(n => n.name === key)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key,
          });
        }
      });

      regionsOrder.forEach(key => {
        const node = nodes.find(n => n.name === key);
        if (node && regions[key]) {
          links.push({
            source: index,
            target: node.node,
            value: regions[key].value,
          });
        }
      });
    }
  });

  return {nodes, links, transfers};
}