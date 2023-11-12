import { fromCountryField, fromLeagueField, fromRegionField, inType, insideType, outType, region, regionEurope, toCountryField, toLeagueField, toRegionField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const toLeagues = (data, country) => {
  let filteredByCountry = [];
  const currentLeagues = {};

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === outType);

  filteredByCountry = filteredByType.filter(d => 
    d[toRegionField] === regionEurope
    && d[toCountryField] === country 
  );

  filteredByCountry.reduce((prev, curr, i) => {
    if (!currentLeagues[curr[toLeagueField]]) {
      currentLeagues[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
    } else {
      currentLeagues[curr[toLeagueField]].value += 1;
    }
  }, currentLeagues);

  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(currentLeagues)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  leaguesOrder.forEach(key => {
    const fromLeagues = filteredByCountry.filter(d => 
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
        if (!regions[curr[toLeagueField]]) {
          regions[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
        } else {
          regions[curr[toLeagueField]].value += 1;
        }
      }, regions);
      
      orderedKeys.forEach(key => {
        if (!nodes.find(n => n.name === key)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key,
          });
        }
      });

      orderedKeys.forEach(key => {
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