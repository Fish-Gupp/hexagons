import { BoardType } from '../components/Board/Board';
import { getTowerHeight } from '../components/Board/Tower';
// import { width } from '../settings';

function getDropIndex(board: BoardType, towerIndex: number): number {
  // const oddOffset = towerIndex % 2;
  const tower = board.layout[towerIndex];
  const height = getTowerHeight(tower);

  // if (towerIndex > 0) {
  //   const leftTower = board.layout[towerIndex - 1];
  //   const leftTowerHeight = getTowerHeight(leftTower) - oddOffset;
  //   height = Math.max(height, leftTowerHeight);
  // }

  // if (towerIndex < width - 1) {
  //   const rightTower = board.layout[towerIndex + 1];
  //   const rightTowerHeight = getTowerHeight(rightTower) - oddOffset;
  //   height = Math.max(height, rightTowerHeight);
  // }

  return height;
}

export default getDropIndex;
