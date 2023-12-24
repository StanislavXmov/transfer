import { africa, asiaRight, europeRight, northAmerica, southAmericaRight, top } from "./order";

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
  
  let order = []
  if (selectedRegion === 'Europe, ex. Top Leagues') {
    order = europeRight;
  } else if (selectedRegion === 'South America') {
    order = southAmericaRight;
  } else if (selectedRegion === 'North America') {
    order = northAmerica;
  } else if (selectedRegion === 'No club') {
    order = ['-'];
  } else if (selectedRegion === 'Asia') {
    order = asiaRight;
  } else if (selectedRegion === 'Africa') {
    order = africa;
  } else if (selectedRegion === 'Top') {
    order = top;
  } else if (selectedRegion === 'Retired') {
    order = ['-'];
  }

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
        source: 0,
        target: countries[key].index,
        value: countries[key].value,
        data: {type: 'right'}
      });
    }
  });

  // console.log({nodes, links, transfers});
  return {nodes, links, transfers};
} 