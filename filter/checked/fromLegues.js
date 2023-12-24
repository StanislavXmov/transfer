import { fromCountryField, fromLeagueField, fromRegionField, inType, insideType, region, toLeagueField, toRegionField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const fromLegues = (data, country, firstFilter) => {
  let filteredByCountry = [];
  const currentLeagues = {};

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === insideType);

  if (firstFilter === region) {
    filteredByCountry = filteredByType.filter(d => 
      d[fromCountryField] === country 
      && d[toRegionField] === region 
      && d[fromRegionField] === region
    );
  } else {
    filteredByCountry = filteredByType.filter(d => 
      d[fromCountryField] === country 
      && d[toRegionField] === region 
      && d[fromRegionField] !== region
    );
  }

  filteredByCountry.reduce((prev, curr, i) => {
    if (!currentLeagues[curr[fromLeagueField]]) {
      currentLeagues[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      currentLeagues[curr[fromLeagueField]].value += 1;
    }
  }, currentLeagues);

  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(currentLeagues)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  orderedKeys.forEach(key => {
    const fromLeagues = filteredByCountry.filter(d => 
      d[fromLeagueField] === key
    );
    if (fromLeagues.length > 0) {
      transfers += fromLeagues.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key,
      });

      const leagues = {};
      fromLeagues.reduce((prev, curr, i) => {
        if (!leagues[curr[toLeagueField]]) {
          leagues[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
        } else {
          leagues[curr[toLeagueField]].value += 1;
        }
      }, leagues);
      
      leaguesOrder.forEach(key => {
        if (filteredByCountry.find(t => t[toLeagueField] === key.key) && !nodes.find(n => n.name === key.title)) {
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