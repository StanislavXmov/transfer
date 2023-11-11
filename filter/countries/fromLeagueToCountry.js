import { fromRegionField, insideType, outType, region, regionEurope, toCountryField, toLeagueField, toRegionField, typeField } from "../../fields";

export const fromLeagueToCountry = (data, country) => {

  const filteredByType = data.filter(d => 
    d[typeField] === outType || d[typeField] === insideType);
  const filteredByCountry = filteredByType.filter(d => 
    // d[fromRegionField] === region 
    d[toRegionField] === regionEurope
    && d[toCountryField] === country 
    // test
    // && d[toRegionField] !== regionEurope
  );
  const transfers = filteredByCountry.length;

  const leagues = {};
  filteredByCountry.reduce((prev, curr, i) => {
    if (!leagues[curr[toLeagueField]]) {
      leagues[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
    } else {
      leagues[curr[toLeagueField]].value += 1;
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
      source: 0,
      target: leagues[key].index,
      value: leagues[key].value,
    });
  });

  return {nodes, links, transfers};
}