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

  Object.keys(regions).forEach(key => {
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

      Object.keys(leagues).forEach(key => {
        if (!nodes.find(n => n.name === key)) {
          const index = nodes.length;
          nodes.push({
            node: index,
            name: key,
            root: true
          });
        }
      });

      Object.keys(leagues).forEach(key => {
        const node = nodes.find(n => n.name === key);
        if (node) {
          links.push({
            source: index,
            target: node.node,
            value: leagues[key].value,
          });
        }
      });
    }
  });
  
  // console.log({nodes, links});
  // console.log(transfers);
  return {nodes, links, transfers};
}