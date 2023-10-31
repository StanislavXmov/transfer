import { asiaLeft, europeLeft, northAmerica, southAmericaLeft } from "./order";

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

  let order = []
  if (selectedRegion === 'Europe, ex. Top Leagues') {
    order = europeLeft;
  } else if (selectedRegion === 'South America') {
    order = southAmericaLeft;
  } else if (selectedRegion === 'North America') {
    order = northAmerica;
  } else if (selectedRegion === 'No club') {
    order = ['-'];
  } else if (selectedRegion === 'Asia') {
    order = asiaLeft;
  }

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
  console.log(countries);
  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  order.forEach(key => {
    if (countries[key]) {
      const index = nodes.length;
      countries[key].index = index;
      nodes.push({
        node: index,
        name: countries[key].title,
      });
    }
  });

  order.forEach(key => {
    if (countries[key]) {
      links.push({
        source: countries[key].index,
        target: 0,
        value: countries[key].value,
      });
    }
  });

  // console.log({nodes, links, transfers});
  return {nodes, links, transfers};
} 