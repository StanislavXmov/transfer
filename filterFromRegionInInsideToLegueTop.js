export const filterFromRegionInInsideToLegueTop = (data) => {
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

  // From Region In Inside  => To League Top
  const regions = {};
  data.reduce((prev, curr, i) => {
    if (!regions[curr[fromRegionField]]) {
      regions[curr[fromRegionField]] = {value: 1, title: curr[fromRegionField]}
    } else {
      regions[curr[fromRegionField]].value += 1;
    }
  }, regions);

  const nodes = [];
  const links = [];
  let transfers = 0;

  regionsOrder.forEach(key => {
    const fromRegions = data.filter(
      d => (d[pathField] === insideType || d[pathField] === inType) && d[fromRegionField] === key && d[toRegionField] === region
    );
    if (fromRegions.length > 0) {
      transfers += fromRegions.length;
      const index = nodes.length;
      nodes.push({
        node: index,
        name: key,
      });

      const leagues = {};
      fromRegions.reduce((prev, curr, i) => {
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
            root: true
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