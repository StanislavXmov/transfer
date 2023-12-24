import { fromRegionField, insideType, outType, playerField, region, toCountryField, toLeagueField, toRegionField, toTeamField, typeField } from "../../fields";

export const fromTeamsToFootballmansOut = (data, team, firstFilter, secondFilter, thirdFilter) => {
  let filtered = [];

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

  const transfers = filtered.length;

  const players = {};
  filtered.reduce((prev, curr, i) => {
    if (!players[curr[playerField]]) {
      players[curr[playerField]] = {value: 1, title: curr[playerField]}
    } else {
      players[curr[playerField]].value += 1;
    }
  }, players);

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  const orderedKeys = Object.entries(players)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  orderedKeys.forEach(key => {
    const index = nodes.length;
    players[key].index = index;
    nodes.push({
      node: index,
      name: players[key].title,
    });
  });
  
  orderedKeys.forEach(key => {
    links.push({
      source: 0,
      target: players[key].index,
      value: players[key].value,
      data: {type: 'right'}
    });
  });
  
  return {nodes, links, transfers};
}