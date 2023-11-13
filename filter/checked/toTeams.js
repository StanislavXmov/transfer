import { fromLeagueField, inType, outType, regionEurope, toCountryField, toLeagueField, toRegionField, toTeamField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const toTeams = (data, league, secondFilter) => {
  let filteredByCountry = [];
  const currentTeams = {};

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === outType);

  filteredByCountry = filteredByType.filter(d => 
    d[toRegionField] === regionEurope
    && d[toCountryField] === secondFilter
    && d[toLeagueField] === league
  );

  filteredByCountry.reduce((prev, curr, i) => {
    if (!currentTeams[curr[toTeamField]]) {
      currentTeams[curr[toTeamField]] = {value: 1, title: curr[toTeamField]}
    } else {
      currentTeams[curr[toTeamField]].value += 1;
    }
  }, currentTeams);
  
  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(currentTeams)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  leaguesOrder.forEach(key => {
    const fromLeagues = filteredByCountry.filter(d => 
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
        if (!regions[curr[toTeamField]]) {
          regions[curr[toTeamField]] = {value: 1, title: curr[toTeamField]}
        } else {
          regions[curr[toTeamField]].value += 1;
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