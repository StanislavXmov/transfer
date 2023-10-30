export const filterByCountryToTop = (data, selectedRegion) => {
  const fromLevelField = 'From Level';
  const fromLeagueField = 'From League';
  const toLeagueField = 'To League';
  const region = 'Top';
  const fromRegionField = 'From Region';
  const fromCountryField = 'From Country';

  const outType = 'Out';
  const inType = 'In';
  const insideType = 'Inside';
  const toRegionField = 'To Region';
  const pathField = '';

  const filteredByType = data.filter(d => 
    d[pathField] === inType || d[pathField] === insideType);
  const filteredByRegions = filteredByType.filter(d => 
    d[fromRegionField] === selectedRegion && d[toRegionField] === region);
  const transfers = filteredByRegions.length;

  const countries = {};
  filteredByRegions.reduce((prev, curr, i) => {
    if (!countries[curr[fromCountryField]]) {
      countries[curr[fromCountryField]] = {value: 1, title: curr[fromCountryField]}
    } else {
      countries[curr[fromCountryField]].value += 1;
    }
  }, countries);

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
      source: countries[key].index,
      target: 0,
      value: countries[key].value,
    });
  });

  // console.log({nodes, links, transfers});
  return {nodes, links, transfers};
} 