import React from 'react';
import { createUseStyles } from 'react-jss';
import { borderWidth, width } from '../../settings';
import { BoardType } from './Board';

export type Cardinal = 'n' | 'ne' | 'se' | 's' | 'sw' | 'nw';

export type HexagonType = {
  towerIndex: number;
  color: string;
  name: string;
  playerNumber?: number;
  hexagonIndex: number;
  isOdd: number;
};

const sqrtThree = Math.sqrt(3);
const border = `${borderWidth}px solid black`;

const useStyles = createUseStyles({
  content: {
    position: 'absolute',
    top: '10px',
  },
  cssHexagon: {
    '&:after': {
      transform: 'rotate(-60deg)',
    },
    '&:before': {
      transform: 'rotate(60deg)',
    },
    '&:before, &:after': {
      backgroundColor: (props) => props.color,
      borderBottom: border,
      borderTop: border,
      content: '""',
      height: 'inherit',
      paddingTop: 'inherit',
      position: 'absolute',
      top: 0,
      width: 'inherit',
    },
    backgroundColor: (props) => props.color,
    borderBottom: border,
    borderTop: border,
    paddingTop: '100%',
    width: `${100 / sqrtThree}%`,
  },
  hexagon: {
    marginBottom: `${100 / width}%`,
    position: 'relative',
  },
});

const Hexagon = ({
  hexagon,
  board,
}: {
  hexagon: HexagonType;
  board: BoardType;
}): JSX.Element => {
  const player =
    hexagon.playerNumber === 1
      ? board.player1
      : hexagon.playerNumber === 2
      ? board.player2
      : null;

  const classes = useStyles({
    color: player ? player.color : hexagon.color,
  });

  return (
    <div className={classes.hexagon}>
      <div className={classes.cssHexagon}></div>
      <div className={classes.content}></div>
    </div>
  );
};

export default Hexagon;
