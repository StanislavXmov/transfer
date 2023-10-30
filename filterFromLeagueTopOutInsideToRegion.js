export const filterFromLeagueTopOutInsideToRegion = (data) => {
  const fromLevelField = 'From Level';
  const fromLeagueField = 'From League';
  const toLeagueField = 'To League';
  const region = 'Top';
  const fromRegionField = 'From Region';
  const outType = 'Out';
  const inType = 'In';
  const insideType = 'Inside';
  const toRegionField = 'To Region';
  const pathField = '';
  const regionsOrder = [
    'Top', 
    'Europe', 
    'Asia', 
    'Latin America', 
    'US & Australia', 
    'Africa', 
    '-'
  ];
  const leaguesOrder = [
    {key: 'Premier League, England', title: 'Premier League 🇬🇧'},
    {key: 'Bundesliga, German', title: 'Bundesliga 🇩🇪'},
    {key: 'LaLiga, Spain', title: 'LaLiga 🇪🇸'},
    {key: 'Serie A, Italy', title: 'Serie A 🇮🇹'},
    {key: 'Ligue 1, France', title: 'Ligue 1 🇫🇷'}
  ];

  // From League Top Out Inside => To  Region
  const leagues = {};
  data.reduce((prev, curr, i) => {
    if (!leagues[curr[fromLeagueField]]) {
      leagues[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      leagues[curr[fromLeagueField]].value += 1;
    }
  }, leagues);

  const nodes = [];
  const links = [];
  let transfers = 0;

  leaguesOrder.forEach(key => {
    const fromLeagues = data.filter(
      d => (d[pathField] === insideType || d[pathField] === outType) && d[fromLeagueField] === key.key
    );
    if (fromLeagues.length > 0) {
      transfers += fromLeagues.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key.title,
        root: true,
      });
      const regions = {};
      fromLeagues.reduce((prev, curr, i) => {
        if (!regions[curr[toRegionField]]) {
          regions[curr[toRegionField]] = {value: 1, title: curr[toRegionField]}
        } else {
          regions[curr[toRegionField]].value += 1;
        }
      }, regions);
      
      regionsOrder.forEach(key => {
        if (!nodes.find(n => n.name === key)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key,
          });
        }
      });

      regionsOrder.forEach(key => {
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