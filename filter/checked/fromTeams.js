import { fromCountryField, fromLeagueField, fromRegionField, fromTeamField, inType, insideType, region, toLeagueField, toRegionField, typeField } from "../../fields";
import { leaguesOrder } from "../../order";

export const fromTeams = (data, league, secondFilter) => {
  let filteredByCountry = [];
  const currentTeams = {};

  const filteredByType = data.filter(d => 
    d[typeField] === inType || d[typeField] === insideType);

  filteredByCountry = filteredByType.filter(d => 
    d[fromCountryField] === secondFilter 
    && d[toRegionField] === region 
    && d[fromRegionField] !== region
    && d[fromLeagueField] === league
  );

  filteredByCountry.reduce((prev, curr, i) => {
    if (!currentTeams[curr[fromTeamField]]) {
      currentTeams[curr[fromTeamField]] = {value: 1, title: curr[fromTeamField]}
    } else {
      currentTeams[curr[fromTeamField]].value += 1;
    }
  }, currentTeams);

  const nodes = [];
  const links = [];
  let transfers = 0;

  const orderedKeys = Object.entries(currentTeams)
    .sort((a, b) => b[1].value - a[1].value)
    .map(k => k[0]);

  orderedKeys.forEach(key => {
    const fromLeagues = filteredByCountry.filter(d => 
      d[fromTeamField] === key
    );
    if (fromLeagues.length > 0) {
      transfers += fromLeagues.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key,
      });

      const leagues = {};
      fromLeagues.reduce((prev, curr, i) => {
        if (!leagues[curr[toLeagueField]]) {
          leagues[curr[toLeagueField]] = {value: 1, title: curr[toLeagueField]}
        } else {
          leagues[curr[toLeagueField]].value += 1;
        }
      }, leagues);
      
      leaguesOrder.forEach(key => {
        // filter 
        if (filteredByCountry.find(t => t[toLeagueField] === key.key) && !nodes.find(n => n.name === key.title)) {
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
          });
        }
      });
    }
  });
  return {nodes, links, transfers};
}