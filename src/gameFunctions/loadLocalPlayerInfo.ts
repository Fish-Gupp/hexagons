import { PlayerType } from '../components/Player';

function loadLocalPlayerInfo(playerNumber: number): PlayerType {
  try {
    const playerString = localStorage.getItem('hexagon-player');
    if (playerString) {
      const player: PlayerType = JSON.parse(playerString);
      if (player) {
        const loaded = {
          color: player.color || playerNumber === 1 ? 'red' : 'green',
          editable: true,
          id: playerNumber,
          name: player.name || `Player ${playerNumber}`,
        };
        console.warn('player loaded', loaded);
        return loaded;
      }
    }
  } catch {
    // empty
  }
  const created = {
    color: playerNumber === 1 ? 'red' : 'green',
    editable: true,
    id: playerNumber,
    name: `Player ${playerNumber}`,
  };
  console.warn('player loaded', created);
  return created;
}

export default loadLocalPlayerInfo;
