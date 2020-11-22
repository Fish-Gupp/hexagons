import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { height, width } from '../settings';
import { HexagonType } from './Hexagon';
import Tower, { TowerType } from './Tower';

type BoardType = TowerType[];

const useStyles = createUseStyles({
  board: {
    whiteSpace: 'nowrap',
  },
});

const Board = (): JSX.Element => {
  const classes = useStyles();
  const [board, setBoard] = useState(getNewBoard());

  return (
    <div className={classes.board}>
      {board.map((tower, index) => (
        <Tower
          onClick={() => {
            console.log(index);
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

function getNewBoard(): BoardType {
  const board = [];
  for (let bi = 0; bi < width; bi++) {
    const tower = [];
    for (let ti = 0; ti < height; ti++) {
      const hexagon: HexagonType = {
        name: `${bi}:${ti}`,
        neighbors: {},
      };
      tower.push(hexagon);
    }
    tower.reverse();
    board.push(tower);
  }

  for (let bi = 0; bi < width; bi++) {
    const tower = board[bi];
    for (let ti = 0; ti < height; ti++) {
      const hexagon = tower[ti];
      if (ti < height - 1) {
        hexagon.neighbors.n = tower[ti + 1];
        if (bi < width - 1) {
          hexagon.neighbors.ne = board[bi + 1][ti + 1];
        }
        if (bi > 0) {
          hexagon.neighbors.nw = board[bi - 1][ti + 1];
        }
      }
      if (ti > 0) {
        hexagon.neighbors.s = tower[ti - 1];
        if (bi < width - 1) {
          hexagon.neighbors.se = board[bi + 1][ti];
        }
        if (bi > 0) {
          hexagon.neighbors.sw = board[bi - 1][ti];
        }
      }
    }
  }

  return board;
}
