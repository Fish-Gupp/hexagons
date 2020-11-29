import React from 'react';
import Hexagon, { HexagonType } from './Hexagon';
import { createUseStyles } from 'react-jss';
import { borderWidth, width } from '../../settings';
import { BoardType } from './Board';

export type TowerType = HexagonType[];

const useStyles = createUseStyles({
  even: {},
  odd: {
    marginBottom: `calc(${100 / 2 / width}% + ${borderWidth * 2}px)`,
  },
  tower: {
    display: 'inline-block',
    // marginRight: `calc(${100 / 3 / width}% + ${borderWidth * 2}px)`,
    position: 'relative',
    width: `${100 / width}%`,
  },
});

const Tower = ({
  tower,
  index,
  board,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  tower: TowerType;
  index: number;
  board: BoardType;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}): JSX.Element => {
  const classes = useStyles();
  const reverseTower = [...tower].reverse();

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${classes.tower} ${
        index % 2 === 0 ? classes.even : classes.odd
      }`}
    >
      {reverseTower.map((hexagon, index) => (
        <Hexagon key={index} hexagon={hexagon} board={board} />
      ))}
    </div>
  );
};

export default Tower;

export function getTowerHeight(tower: TowerType): number {
  for (let index = tower.length - 1; index >= 0; index--) {
    const hexagon = tower[index];
    if (hexagon.playerNumber) {
      return index + 1;
    }
  }
  return 0;
}
