import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { height, width } from '../settings';
import { PlayerType } from '../types/Player';
import { HexagonType } from './Hexagon';
import Tower, { TowerType } from './Tower';

type BoardType = {
  winner?: number;
  layout: TowerType[];
};

const useStyles = createUseStyles({
  board: {
    whiteSpace: 'nowrap',
  },
});

const Board = (): JSX.Element => {
  const classes = useStyles();
  const [board, setBoard] = useState(getNewBoard());
  const [players] = useState(getNewPlayers());
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [winner, setWinner] = useState<PlayerType | null>(null);

  return (
    <div className={classes.board}>
      {winner && <h1>Winner! {winner.name}</h1>}
      {board.layout.map((tower, index) => (
        <Tower
          onClick={() => {
            const newBoard = dropHexagon(board, currentPlayer, index);
            setBoard(newBoard);
            const newWinner = checkForWinner(board);
            setWinner(newWinner);
            setCurrentPlayer(
              players.indexOf(currentPlayer) === 0 ? players[1] : players[0]
            );
          }}
          key={index}
          index={index}
          tower={tower}
        />
      ))}
    </div>
  );
};

export default Board;

function dropHexagon(board: BoardType, player: PlayerType, towerIndex: number) {
  const dropIndex = getDropIndex(board, towerIndex);
  const newBoard = {
    ...board,
  };
  if (dropIndex < height) {
    newBoard.layout[towerIndex][dropIndex].player = player;
  }
  return newBoard;
}

function getDropIndex(board: BoardType, towerIndex: number): number {
  const oddOffset = towerIndex % 2;
  const tower = board.layout[towerIndex];
  let height = getTowerHeight(tower);

  if (towerIndex > 0) {
    const leftTower = board.layout[towerIndex - 1];
    const leftTowerHeight = getTowerHeight(leftTower) - oddOffset;
    height = Math.max(height, leftTowerHeight);
  }

  if (towerIndex < width - 1) {
    const rightTower = board.layout[towerIndex + 1];
    const rightTowerHeight = getTowerHeight(rightTower) - oddOffset;
    height = Math.max(height, rightTowerHeight);
  }

  return height;
}

function getTowerHeight(tower: TowerType): number {
  for (let index = tower.length - 1; index >= 0; index--) {
    const hexagon = tower[index];
    if (hexagon.player) {
      return index + 1;
    }
  }
  return 0;
}

function checkForWinner(board: BoardType): PlayerType | null {
  return null;
}

function getNewPlayers(): PlayerType[] {
  return [
    {
      name: 'Player 1',
      color: 'red',
    },
    {
      name: 'Player 2',
      color: 'green',
    },
  ];
}

function getNewBoard(): BoardType {
  const board: BoardType = {
    layout: [],
  };

  // creating hexagons
  for (let bi = 0; bi < width; bi++) {
    const tower = [];
    for (let ti = 0; ti < height; ti++) {
      const hexagon: HexagonType = {
        name: `${bi}:${ti}`,
        neighbors: {},
      };
      tower.push(hexagon);
    }
    board.layout.push(tower);
  }

  // setting refernces to neighboring hexagons
  for (let bi = 0; bi < width; bi++) {
    const tower = board.layout[bi];
    for (let ti = 0; ti < height; ti++) {
      const hexagon = tower[ti];
      if (ti < height - 1) {
        hexagon.neighbors.n = tower[ti + 1];
        if (bi < width - 1) {
          hexagon.neighbors.ne = board.layout[bi + 1][ti + 1];
        }
        if (bi > 0) {
          hexagon.neighbors.nw = board.layout[bi - 1][ti + 1];
        }
      }
      if (ti > 0) {
        hexagon.neighbors.s = tower[ti - 1];
        if (bi < width - 1) {
          hexagon.neighbors.se = board.layout[bi + 1][ti];
        }
        if (bi > 0) {
          hexagon.neighbors.sw = board.layout[bi - 1][ti];
        }
      }
    }
  }

  return board;
}
