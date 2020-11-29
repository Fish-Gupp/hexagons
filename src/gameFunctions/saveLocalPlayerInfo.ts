import { PlayerType } from '../components/Player';

function saveLocalPlayerInfo(player: PlayerType): void {
  if (!player) return;
  const savePlayerData: { [id: string]: string | number | boolean | null } = {
    ...player,
  };
  if (savePlayerData.color === 'red' || savePlayerData.color === 'green') {
    savePlayerData.color = '';
  }
  savePlayerData.editable = null;
  console.warn('saveLocalPlayerInfo', savePlayerData, player);
  localStorage.setItem('hexagon-player', JSON.stringify(savePlayerData));
}

export default saveLocalPlayerInfo;
