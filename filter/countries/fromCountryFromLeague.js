import { fromCountryField, fromLeagueField, fromRegionField, inType, insideType, outType, region, toCountryField, toRegionField, typeField } from "../../fields";

export const fromCountryFromLeague = (data, country, firstFilter) => {
  let filteredByCountry = [];

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === insideType);

  if (firstFilter === region) {
    const filteredByRegions = filteredByType.filter(d => 
      d[fromRegionField] === region 
      && d[toRegionField] === region
    );
    filteredByCountry = filteredByRegions.filter(d => 
      d[fromCountryField] === country
    );
  } else {
    filteredByCountry = filteredByType.filter(d => 
      d[fromCountryField] === country 
      && d[toRegionField] === region 
      && d[fromRegionField] !== region
    );
  }
  
  const transfers = filteredByCountry.length;

  const leagues = {};
  filteredByCountry.reduce((prev, curr, i) => {
    if (!leagues[curr[fromLeagueField]]) {
      leagues[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      leagues[curr[fromLeagueField]].value += 1;
    }
  }, leagues);

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  const orderedKeys = Object.entries(leagues)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  orderedKeys.forEach(key => {
    const index = nodes.length;
    leagues[key].index = index;
    nodes.push({
      node: index,
      name: leagues[key].title,
    });
  });

  orderedKeys.forEach(key => {
    links.push({
      source: leagues[key].index,
      target: 0,
      value: leagues[key].value,
      data: {type: 'left'}
    });
  });

  return {nodes, links, transfers};
}