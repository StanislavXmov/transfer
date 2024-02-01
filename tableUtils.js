import {
  ageField,
  feeField, 
  fromCountryField, 
  fromLeagueField, 
  fromRegionField, 
  fromTeamField, 
  marketValueField, 
  playerField, 
  toCountryField, 
  toLeagueField, 
  toRegionField, 
  toTeamField
} from "./fields";

export const createRow = (item) => {
  const div = document.createElement('div');
  div.classList.add('tableRows');

  div.innerHTML = `
    <span class="tableCell width10">${item[playerField]}</span>
    <span class="tableCell width3">${item[ageField]}</span>
    <span class="tableCell width7">${item['Nationality']}</span>
    <span class="tableCell width5">${item['Position']}</span>
    <span class="tableCell width5">${item[marketValueField]}</span>
    <span class="tableCell width5">${item[feeField]}</span>
    <span class="tableCell width8">${item[fromTeamField]}</span>
    <span class="tableCell width8">${item[fromLeagueField]}</span>
    <span class="tableCell width8">${item[fromCountryField]}</span>
    <span class="tableCell width8">${item[fromRegionField]}</span>
    <span class="tableCell width8">${item[toTeamField]}</span>
    <span class="tableCell width8">${item[toLeagueField]}</span>
    <span class="tableCell width8">${item[toCountryField]}</span>
    <span class="tableCell width8">${item[toRegionField]}</span>
  `;

  return div;
}