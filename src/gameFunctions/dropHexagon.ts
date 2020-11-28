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
    currentPlayer:
      board.currentPlayer && board.currentPlayer.id === 1
        ? board.player2
        : board.player1,
  };
  const hexagon = newBoard.layout[towerIndex][dropIndex];
  hexagon.player = board.currentPlayer;
  return [newBoard, hexagon];
}

export default dropHexagon;
