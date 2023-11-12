import { fromCountryField, fromLeagueField, fromRegionField, inType, insideType, outType, region, toCountryField, toLeagueField, toRegionField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const toCountries = (data, regionType) => {
  const countries = {};

  const filtered = data.filter(d => 
    (d[typeField] === insideType || d[typeField] === outType) 
    && d[fromRegionField] === region
    && d[toRegionField] === regionType
  );

  filtered.reduce((prev, curr, i) => {
    if (!countries[curr[toCountryField]]) {
      countries[curr[toCountryField]] = {value: 1, title: curr[toCountryField]}
    } else {
      countries[curr[toCountryField]].value += 1;
    }
  }, countries);

  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(countries)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  leaguesOrder.forEach(key => {
    const fromLeagues = filtered.filter(d => 
      d[fromLeagueField] === key.key
    );
    if (fromLeagues.length > 0) {
      transfers += fromLeagues.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key.title,
        root: true,
        isLeagues: true,
      });
      const regions = {};
      fromLeagues.reduce((prev, curr, i) => {
        if (!regions[curr[toCountryField]]) {
          regions[curr[toCountryField]] = {value: 1, title: curr[toCountryField]}
        } else {
          regions[curr[toCountryField]].value += 1;
        }
      }, regions);

      orderedKeys.forEach(key => {
        if (!nodes.find(n => n.name === key)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key,
          });
        }
      });

      orderedKeys.forEach(key => {
        const node = nodes.find(n => n.name === key);
        if (node && regions[key]) {
          links.push({
            source: index,
            target: node.node,
            value: regions[key].value,
          });
        }
      });
    }
  });
  return {nodes, links, transfers};
}