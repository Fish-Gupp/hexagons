import { BoardType } from '../components/Board/Board';
import { Cardinal, HexagonType } from '../components/Board/Hexagon';
import { PlayerType } from '../components/Player';

function checkForWinner(board: BoardType, hexagon: HexagonType): PlayerType {
  if (!hexagon.player) return null;

  function nextagon(
    board: BoardType,
    hexagon: HexagonType,
    d1: Cardinal
  ): HexagonType {
    const east = board.layout[hexagon.towerIndex + 1];
    const west = board.layout[hexagon.towerIndex - 1];
    switch (d1) {
      case 'n':
        return (
          board.layout[hexagon.towerIndex][hexagon.hexagonIndex + 1] ||
          undefined
        );
      case 's':
        return (
          board.layout[hexagon.towerIndex][hexagon.hexagonIndex - 1] ||
          undefined
        );
      case 'ne':
        return (
          (east && east[hexagon.hexagonIndex + hexagon.isOdd]) || undefined
        );
      case 'nw':
        return (
          (west && west[hexagon.hexagonIndex + hexagon.isOdd]) || undefined
        );
      case 'se':
        return (
          (east && east[hexagon.hexagonIndex - 1 + hexagon.isOdd]) || undefined
        );
      case 'sw':
        return (
          (west && west[hexagon.hexagonIndex - 1 + hexagon.isOdd]) || undefined
        );
    }
  }

  function matchesInDirection(
    board: BoardType,
    hexagon: HexagonType,
    d1: Cardinal
  ): number {
    let count = 0;
    let testagon = nextagon(board, hexagon, d1);
    while (
      testagon &&
      testagon.player &&
      hexagon.player &&
      testagon.player.id === hexagon.player.id
    ) {
      count++;
      testagon = nextagon(board, testagon, d1);
    }
    return count;
  }

  function isFour(
    board: BoardType,
    hexagon: HexagonType,
    d1: Cardinal,
    d2: Cardinal
  ): boolean {
    if (
      matchesInDirection(board, hexagon, d1) +
        matchesInDirection(board, hexagon, d2) +
        1 >=
      4
    ) {
      return true;
    }
    return false;
  }

  if (isFour(board, hexagon, 'n', 's')) return hexagon.player;
  if (isFour(board, hexagon, 'ne', 'sw')) return hexagon.player;
  if (isFour(board, hexagon, 'nw', 'se')) return hexagon.player;
  return null;
}

export default checkForWinner;
