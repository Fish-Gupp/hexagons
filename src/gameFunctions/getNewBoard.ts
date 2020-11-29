import { BoardType } from '../components/Board/Board';
import { HexagonType } from '../components/Board/Hexagon';
import { PlayerType } from '../components/Player';
import { height, width } from '../settings';

function getNewBoard(player1: PlayerType): BoardType {
  console.warn('getNewBoard', player1);
  const board: BoardType = {
    currentPlayerId: 1,
    layout: [],
    player1,
    player2: null,
    winner: null,
  };

  // creating hexagons
  for (let towerIndex = 0; towerIndex < width; towerIndex++) {
    const tower = [];
    for (let hexagonIndex = 0; hexagonIndex < height; hexagonIndex++) {
      const hexagon: HexagonType = {
        color: 'white',
        hexagonIndex,
        isOdd: towerIndex % 2,
        name: `${towerIndex}:${hexagonIndex}`,
        towerIndex,
      };
      tower.push(hexagon);
    }
    board.layout.push(tower);
  }

  return board;
}

export default getNewBoard;
