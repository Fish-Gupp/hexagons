import React from 'react';
import { createUseStyles } from 'react-jss';
import { width } from '../settings';

export type HexagonType = {
  name: string;
  player?: number;
  color?: string;
  neighbors: {
    n?: HexagonType;
    ne?: HexagonType;
    se?: HexagonType;
    s?: HexagonType;
    sw?: HexagonType;
    nw?: HexagonType;
  };
};

const sqrtThree = 1.73205;
const color = 'green';

const useStyles = createUseStyles({
  hexagon: {
    position: 'relative',
    textAlign: 'left',
    marginBottom: `${2 / width}vw`,
  },
  content: {
    position: 'absolute',
    top: '10px',
  },
  cssHexagon: {
    width: `${90 / width / sqrtThree}vw`,
    height: `${90 / width}vw`,
    backgroundColor: color,
    '&:before, &:after': {
      backgroundColor: color,
      content: '""',
      height: 'inherit',
      position: 'absolute',
      width: 'inherit',
    },
    '&:before': {
      transform: 'rotate(60deg)',
    },
    '&:after': {
      transform: 'rotate(-60deg)',
    },
  },
});

const Hexagon = ({ hexagon }: { hexagon: HexagonType }): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.hexagon}>
      <div className={classes.cssHexagon}></div>
      <div className={classes.content}>{hexagon.name}</div>
    </div>
  );
};

export default Hexagon;
