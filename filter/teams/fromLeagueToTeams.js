import { fromCountryField, fromLeagueField, fromRegionField, fromTeamField, inType, insideType, region, toRegionField, toTeamField, typeField } from "../../fields";

export const fromLeagueToTeams = (data, league, firstFilter, secondFilter) => {
  // console.log(data, league, firstFilter, secondFilter);

  let filteredByCountry = [];

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === insideType);

    filteredByCountry = filteredByType.filter(d => 
      d[fromCountryField] === secondFilter 
      && d[toRegionField] === region 
      && d[fromRegionField] !== region
      && d[fromLeagueField] === league
    );
  
  const transfers = filteredByCountry.length;

  const teams = {};
  filteredByCountry.reduce((prev, curr, i) => {
    if (!teams[curr[fromTeamField]]) {
      teams[curr[fromTeamField]] = {value: 1, title: curr[fromTeamField]}
    } else {
      teams[curr[fromTeamField]].value += 1;
    }
  }, teams);

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  const orderedKeys = Object.entries(teams)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  orderedKeys.forEach(key => {
    const index = nodes.length;
    teams[key].index = index;
    nodes.push({
      node: index,
      name: teams[key].title,
    });
  });

  orderedKeys.forEach(key => {
    links.push({
      source: teams[key].index,
      target: 0,
      value: teams[key].value,
    });
  });
  return {nodes, links, transfers};
}