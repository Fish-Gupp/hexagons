import React from 'react';
import Hexagon, { HexagonType } from './Hexagon';
import { createUseStyles } from 'react-jss';
import { width } from '../settings';

export type TowerType = HexagonType[];

const useStyles = createUseStyles({
  tower: {
    display: 'inline-block',
    marginRight: `${30 / width}vw`,
  },
  even: {
    position: 'relative',
    top: `${45 / width}vw`,
  },
  odd: {
    color: 'red',
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

  return (
    <div
      onClick={onClick}
      className={`${classes.tower} ${
        index % 2 === 0 ? classes.even : classes.odd
      }`}
    >
      {tower.map((hexagon, index) => (
        <Hexagon key={index} hexagon={hexagon} />
      ))}
    </div>
  );
};

export default Tower;
