export const filterFromTopToRegion = (data) => {
  const region = 'Top';
  const fromRegionField = 'From Region';
  const toRegionField = 'To Region';
  const out = 'Out';
  const inside = 'Inside';
  const pathField = '';
  const fromTopRegions = data.filter(d => d[fromRegionField] === region);
  const outFromTopRegions = fromTopRegions.filter(d => d[pathField] === out || d[pathField] === inside);

  const regions = {};
  outFromTopRegions.reduce((prev, curr, i) => {
    if (!regions[curr[toRegionField]]) {
      regions[curr[toRegionField]] = {value: 1, title: curr[toRegionField]}
    } else {
      regions[curr[toRegionField]].value += 1;
    }

  }, regions);

  const startNode = {
    node: 0,
    name: 'Top Leagues'
  };
  const nodes = [startNode];
  const links = [];

  Object.keys(regions).forEach(key => {
    const index = nodes.length;
    regions[key].index = index;
    nodes.push({
      node: index,
      name: regions[key].title,
    });
  });

  Object.keys(regions).forEach(key => {
    links.push({
      source: 0,
      target: regions[key].index,
      value: regions[key].value,
    });
  });
  return {nodes, links};
}