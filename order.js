export const regionsOrder = [
  'Top', 
  'Europe, ex. Top Leagues', 
  'Asia', 
  'South America', 
  'North America', 
  'Africa', 
  'No club',
  'Retired'
];

export const africa = [
  'Algeria',
  'Egypt'
];

export const top = [
  'England',
  'France',
  'Germany',
  'Italy',
  'Spain'
];

export const europeLeft = [
  'France',
  'Spain',
  'Germany',
  'Italy',
  'England',
  'Netherlands',
  'Belgium',
  'Portugal',
  'Switzerland',
  'Austria',
  'Denmark',
  'Scotland',
  'Russia',
  'Greece',
  'Czech',
  'Sweden',
  'Croatia',
  'Cyprus',
  'Norway',
  'Romania',
  'Ukraine',
  'Bulgaria',
  'Hungary',
  'Poland',
  'Belarus',
  'Bosnia-H',
  'Slovenia',
  'Ireland',
  'Serbia',
  'Slovakia',
];

export const europeRight = [
  'Italy',
  'England',
  'Spain',
  'Germany',
  'France',
  'Netherlands',
  'Belgium',
  'Portugal',
  'Switzerland',
  'Greece',
  'Austria',
  'Denmark',
  'Russia',
  'Scotland',
  'Poland',
  'Croatia',
  'Cyprus',
  'Ukraine',
  'Malta',
  'Slovenia',
  'Sweden',
  'Czech',
  'Luxembourgh',
  'Serbia',
  'Norway',
  'Bosnia-H',
  'Bulgaria',
  'Ireland',
];

export const asiaLeft = [
  'Turkey',
  'Israel',
  'Georgia',
  'Korea',
  'Saudi Arabia',
];

export const asiaRight = [
  'Turkey',
  'Saudi Arabia',
  'Qatar',
  'UAE',
  'Azerbaijan',
  'Japan',
  'Armenia',
  'Iran',
  'Korea',
];

export const southAmericaLeft = [
  'Brazil',
  'Argentina',
  'Mexico',
  'Uruguay',
  'Colombia',
  'Paraguay',
  'Jamaica',
];

export const southAmericaRight = [
  'Brazil',
  'Mexico',
  'Argentina',
  'Uruguay',
  'Paraguay',
];

export const northAmerica = [
  'US',
  'Australia',
  'Mexico',
  'Jamaica'
];

export const countries = new Set();
top.forEach(c => countries.add(c));
europeLeft.forEach(c => countries.add(c));
europeRight.forEach(c => countries.add(c));
asiaLeft.forEach(c => countries.add(c));
asiaRight.forEach(c => countries.add(c));
southAmericaLeft.forEach(c => countries.add(c));
southAmericaRight.forEach(c => countries.add(c));
northAmerica.forEach(c => countries.add(c));

export const leaguesOrder = [
  {key: 'Premier League, England', title: 'Premier League 🇬🇧'},
  {key: 'Bundesliga, German', title: 'Bundesliga 🇩🇪'},
  {key: 'LaLiga, Spain', title: 'LaLiga 🇪🇸'},
  {key: 'Serie A, Italy', title: 'Serie A 🇮🇹'},
  {key: 'Ligue 1, France', title: 'Ligue 1 🇫🇷'}
];