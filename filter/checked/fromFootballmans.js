import { fromCountryField, fromLeagueField, fromRegionField, fromTeamField, inType, insideType, playerField, region, toLeagueField, toRegionField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const fromFootballmans = (data, team, thirdFilter, secondFilter, firstFilter) => {
  let filtered = [];
  const currentPlayers = {};

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === insideType);

  if (firstFilter === region) {
    filtered = filteredByType.filter(d => 
      d[fromCountryField] === secondFilter
      && d[fromRegionField] === region
      && d[toRegionField] === region 
      && d[fromLeagueField] === thirdFilter
      && d[fromTeamField] === team
    );
  } else {
    filtered = filteredByType.filter(d => 
      d[fromCountryField] === secondFilter 
      && d[toRegionField] === region 
      && d[fromRegionField] !== region
      && d[fromLeagueField] === thirdFilter
      && d[fromTeamField] === team
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

  orderedKeys.forEach(key => {
    const fromLeagues = filtered.filter(d => 
      d[playerField] === key
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
        // filter 
        if (filtered.find(t => t[toLeagueField] === key.key) && !nodes.find(n => n.name === key.title)) {
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