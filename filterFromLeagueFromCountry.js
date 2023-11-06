export const filterFromLeagueFromCountry = (data, selectedCountry) => {
  const fromLevelField = 'From Level';
  const fromLeagueField = 'From League';
  const toLeagueField = 'To League';
  const region = 'Top';
  const fromRegionField = 'From Region';
  const fromCountryField = 'From Country';
  const outType = 'Out';
  const inType = 'In';
  const insideType = 'Inside';
  const toRegionField = 'To Region';
  const pathField = '';

  const belgium = 'Belgium';
  const leaguesOrder = [
    {key: 'Challenger Pro League, Belgium', title: 'Challenger Pro League 🇧🇪'},
    {key: 'Jupiler Pro League, Belgium', title: 'Jupiler Pro League 🇧🇪'},
  ];

  const filteredByType = data.filter(d => 
    d[pathField] === inType || d[pathField] === insideType);
  const filteredByCountry = filteredByType.filter(d => 
    d[fromCountryField] === belgium && d[toRegionField] === region);
  const transfers = filteredByCountry.length;

  const leagues = {};
  filteredByCountry.reduce((prev, curr, i) => {
    if (!leagues[curr[fromLeagueField]]) {
      leagues[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      leagues[curr[fromLeagueField]].value += 1;
    }
  }, leagues);
  console.log({leagues});

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];

  leaguesOrder.forEach(key => {
    if (leagues[key.key]) {
      const index = nodes.length;
      leagues[key.key].index = index;
      nodes.push({
        node: index,
        name: leagues[key.key].title,
      });
    }
  });

  leaguesOrder.forEach(key => {
    if (leagues[key.key]) {
      links.push({
        source: leagues[key.key].index,
        target: 0,
        value: leagues[key.key].value,
      });
    }
  });

  // console.log({nodes, links, transfers});
  return {nodes, links, transfers};

}

export const filterFromCountryFromLeague = (data, selectedCountry) => {
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

  const belgium = 'Belgium';
  const leaguesOrder = [
    {key: 'Challenger Pro League, Belgium', title: 'Challenger Pro League 🇧🇪'},
    {key: 'Jupiler Pro League, Belgium', title: 'Jupiler Pro League 🇧🇪'},
  ];

  const filteredByType = data.filter(d => 
    d[pathField] === outType || d[pathField] === insideType);
  const filteredByCountry = filteredByType.filter(d => 
    d[fromRegionField] === region && d[toCountryField] === belgium);
  const transfers = filteredByCountry.length;

  console.log(filteredByCountry);

  const leagues = {};
  filteredByCountry.reduce((prev, curr, i) => {
    if (!leagues[curr[fromLeagueField]]) {
      leagues[curr[fromLeagueField]] = {value: 1, title: curr[fromLeagueField]}
    } else {
      leagues[curr[fromLeagueField]].value += 1;
    }
  }, leagues);
  console.log({leagues});

  const startNode = {
    node: 0,
    name: 'Top',
    root: true,
  };
  const nodes = [startNode];
  const links = [];


  // leaguesOrder.forEach(key => {
  //   if (leagues[key.key]) {
  //     const index = nodes.length;
  //     leagues[key.key].index = index;
  //     nodes.push({
  //       node: index,
  //       name: leagues[key.key].title,
  //     });
  //   }
  // });

  // leaguesOrder.forEach(key => {
  //   if (leagues[key.key]) {
  //     links.push({
  //       source: leagues[key.key].index,
  //       target: 0,
  //       value: leagues[key.key].value,
  //     });
  //   }
  // });

  // console.log({nodes, links, transfers});
  // return {nodes, links, transfers};

}