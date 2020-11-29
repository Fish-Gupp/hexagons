import { BoardType } from '../components/Board/Board';
import { HexagonType } from '../components/Board/Hexagon';
import { height } from '../settings';
import getDropIndex from './getDropIndex';

function dropHexagon(
  board: BoardType,
  towerIndex: number
): [BoardType, HexagonType | null] {
  const dropIndex = getDropIndex(board, towerIndex);
  if (dropIndex >= height) {
    return [board, null];
  }
  const newBoard: BoardType = {
    ...board,
    currentPlayerId: board.currentPlayerId === 1 ? 2 : 1,
  };
  const hexagon = newBoard.layout[towerIndex][dropIndex];
  hexagon.playerNumber = board.currentPlayerId;
  return [newBoard, hexagon];
}

export default dropHexagon;
