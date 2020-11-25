import React from 'react';
import Hexagon, { HexagonType } from './Hexagon';
import { createUseStyles } from 'react-jss';
import { boardScreenPct, borderWidth, width } from '../settings';

export type TowerType = HexagonType[];

const useStyles = createUseStyles({
  even: {
    top: `calc(${boardScreenPct / 2 / width}vw + ${borderWidth * 2}px)`,
  },
  odd: {},
  tower: {
    display: 'inline-block',
    marginRight: `calc(${boardScreenPct / 3 / width}vw + ${borderWidth * 2}px)`,
    position: 'relative',
  },
});

const Tower = ({
  tower,
  index,
  onClick,
}: {
  tower: TowerType;
  index: number;
  onClick: () => void;
}): JSX.Element => {
  const classes = useStyles();
  const reverseTower = [...tower].reverse();

  return (
    <div
      onClick={onClick}
      className={`${classes.tower} ${
        index % 2 === 0 ? classes.even : classes.odd
      }`}
    >
      {reverseTower.map((hexagon, index) => (
        <Hexagon key={index} hexagon={hexagon} />
      ))}
    </div>
  );
};

export default Tower;
