import { fromLeagueField, fromRegionField, insideType, outType, playerField, region, toCountryField, toLeagueField, toRegionField, toTeamField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const toFootballmans = (data, team, thirdFilter, secondFilter, firstFilter) => {
  let filtered = [];
  const currentPlayers = {};

  const filteredByType = data.filter(d => 
    d[typeField] === outType || d[typeField] === insideType);
  
  if (firstFilter === region) {
    filtered = filteredByType.filter(d => 
      d[toRegionField] === firstFilter
      && d[fromRegionField] === region
      && d[toCountryField] === secondFilter
      && d[toLeagueField] === thirdFilter
      && d[toTeamField] === team
    );
  } else {
    filtered = filteredByType.filter(d => 
      d[toRegionField] === firstFilter
      && d[toCountryField] === secondFilter
      && d[toLeagueField] === thirdFilter
      && d[toTeamField] === team
    );
  }

  filtered.reduce((prev, curr, i) => {
    if (!currentPlayers[curr[playerField]]) {
      currentPlayers[curr[playerField]] = {value: 1, title: curr[playerField]}
    } else {
      currentPlayers[curr[playerField]].value += 1;
    }
  }, currentPlayers);
  
  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(currentPlayers)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);
  
  leaguesOrder.forEach(key => {
    const fromLeagues = filtered.filter(d => 
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
        if (!regions[curr[playerField]]) {
          regions[curr[playerField]] = {value: 1, title: curr[playerField]}
        } else {
          regions[curr[playerField]].value += 1;
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