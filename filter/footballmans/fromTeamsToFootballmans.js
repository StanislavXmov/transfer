import { fromCountryField, fromLeagueField, fromRegionField, fromTeamField, inType, insideType, playerField, region, toRegionField, typeField } from "../../fields";

export const fromTeamsToFootballmans = (data, team, firstFilter, secondFilter, thirdFilter) => {

  let filtered = [];
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
      source: players[key].index,
      target: 0,
      value: players[key].value,
      data: {type: 'left'}
    });
  });

  return {nodes, links, transfers};
}