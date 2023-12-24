import { fromLeagueField, fromRegionField, inType, insideType, outType, region, regionEurope, toCountryField, toLeagueField, toRegionField, toTeamField, typeField } from "../../fields";

export const fromLeagueToTeamsOut = (data, league, firstFilter, secondFilter) => {
  let filteredByCountry = [];

  const filteredByType = data.filter(d => 
    d[typeField] === outType || d[typeField] === insideType);
  
  if (firstFilter === region) {
    filteredByCountry = filteredByType.filter(d => 
      d[toRegionField] === firstFilter
      && d[fromRegionField] === region 
      && d[toCountryField] === secondFilter 
      && d[toLeagueField] === league
    );
  } else {
    filteredByCountry = filteredByType.filter(d => 
      d[toRegionField] === firstFilter
      && d[toCountryField] === secondFilter 
      && d[toLeagueField] === league
    );
  }

  const transfers = filteredByCountry.length;

  const teams = {};
  filteredByCountry.reduce((prev, curr, i) => {
    if (!teams[curr[toTeamField]]) {
      teams[curr[toTeamField]] = {value: 1, title: curr[toTeamField]}
    } else {
      teams[curr[toTeamField]].value += 1;
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
      source: 0,
      target: teams[key].index,
      value: teams[key].value,
      data: {type: 'right'}
    });
  });
  
  return {nodes, links, transfers};
}