export const filterByTopToCountry = (data, selectedRegion) => {
  const fromLevelField = 'From Level';
  const fromLeagueField = 'From League';
  const toLeagueField = 'To League';
  const region = 'Top';
  const fromRegionField = 'From Region';
  const fromCountryField = 'From Country';
  const toCountryField = 'To Country';
  const outType = 'Out';
  const inType = 'In';
  const insideType = 'Inside';
  const toRegionField = 'To Region';
  const pathField = '';

  const filteredByType = data.filter(d => 
    d[pathField] === outType || d[pathField] === insideType);
  
  const filteredByRegions = filteredByType.filter(d => 
    d[fromRegionField] === region && d[toRegionField] === selectedRegion);
  const transfers = filteredByRegions.length;

  const countries = {};
  filteredByRegions.reduce((prev, curr, i) => {
    if (!countries[curr[toCountryField]]) {
      countries[curr[toCountryField]] = {value: 1, title: curr[toCountryField]}
    } else {
      countries[curr[toCountryField]].value += 1;
    }
  }, countries);
  console.log(countries);

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  Object.keys(countries).forEach(key => {
    const index = nodes.length;
    countries[key].index = index;
    nodes.push({
      node: index,
      name: countries[key].title,
    });
  });

  Object.keys(countries).forEach(key => {
    links.push({
      source: 0,
      target: countries[key].index,
      value: countries[key].value,
    });
  });

  // console.log({nodes, links, transfers});
  return {nodes, links, transfers};
} 