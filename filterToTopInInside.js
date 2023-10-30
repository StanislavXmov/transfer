export const filterToTopInInside = (data) => {
  const region = 'Top';
  const fromRegionField = 'From Region';
  const toRegionField = 'To Region';
  const outType = 'Out';
  const inType = 'In';
  const insideType = 'Inside';
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

  const toTopRegions = data.filter(d => d[toRegionField] === region);
  const transfers = toTopRegions.length;

  const regions = {};
  toTopRegions.reduce((prev, curr, i) => {
    if (!regions[curr[fromRegionField]]) {
      regions[curr[fromRegionField]] = {value: 1, title: curr[fromRegionField]}
    } else {
      regions[curr[fromRegionField]].value += 1;
    }
  }, regions);
  
  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];
  
  regionsOrder.forEach(key => {
    if (regions[key]) {
      const index = nodes.length;
      regions[key].index = index;
      nodes.push({
        node: index,
        name: regions[key].title,
      });
    }
  });

  regionsOrder.forEach(key => {
    if (regions[key]) {
      links.push({
        source: regions[key].index,
        target: 0,
        value: regions[key].value,
      });
    }
  });

  // console.log({nodes, links, transfers});
  return {nodes, links, transfers};
}