import { PlayerType } from '../components/Player';

function saveLocalPlayerInfo(player: PlayerType): void {
  const savePlayerData: { [id: string]: string | number | boolean } = {
    ...player,
  };
  if (savePlayerData.color === 'red' || savePlayerData.color === 'green') {
    savePlayerData.color = '';
  }
  console.warn('saveLocalPlayerInfo', savePlayerData);
  localStorage.setItem('hexagon-player', JSON.stringify(savePlayerData));
}

export default saveLocalPlayerInfo;
