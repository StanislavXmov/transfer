import { fromCountryField, fromRegionField, inType, insideType, region, toCountryField, toLeagueField, toRegionField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const fromCountries = (data, regionType) => {
  const countries = {};

  const filtered = data.filter(d => 
    (d[typeField] === insideType || d[typeField] === inType) 
    && d[fromRegionField] === regionType
    && d[toRegionField] === region
  );

  filtered.reduce((prev, curr, i) => {
    if (!countries[curr[fromCountryField]]) {
      countries[curr[fromCountryField]] = {value: 1, title: curr[fromCountryField]}
    } else {
      countries[curr[fromCountryField]].value += 1;
    }
  }, countries);

  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(countries)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  orderedKeys.forEach(key => {
    const fromCountries = data.filter(d => 
      (d[typeField] === insideType || d[typeField] === inType) 
      && d[fromCountryField] === key 
      && d[fromRegionField] === regionType
      && d[toRegionField] === region
    );
    if (fromCountries.length > 0) {
      transfers += fromCountries.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key,
      });

      const leagues = {};
      fromCountries.reduce((prev, curr, i) => {
        if (!leagues[curr[toLeagueField]]) {
          leagues[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
        } else {
          leagues[curr[toLeagueField]].value += 1;
        }
      }, leagues);

      leaguesOrder.forEach(key => {
        if (!nodes.find(n => n.name === key.title)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key.title,
            root: true,
            isLeagues: true,
          });
        }
      });

      leaguesOrder.forEach(key => {
        const node = nodes.find(n => n.name === key.title);
        if (node && leagues[key.key]) {
          links.push({
            source: index,
            target: node.node,
            value: leagues[key.key].value,
            data: {type: 'left', originName: key.key}
          });
        }
      });
    }
  })

  return {nodes, links, transfers};
}