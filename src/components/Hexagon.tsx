import React from 'react';
import { createUseStyles } from 'react-jss';
import { boardScreenPct, borderWidth, width } from '../settings';
import { PlayerType } from '../types/Player';

export type HexagonType = {
  name: string;
  player?: PlayerType;
  neighbors: {
    n?: HexagonType;
    ne?: HexagonType;
    se?: HexagonType;
    s?: HexagonType;
    sw?: HexagonType;
    nw?: HexagonType;
  };
};

const sqrtThree = Math.sqrt(3);
const border = `${borderWidth}px solid black`;

const useStyles = createUseStyles({
  hexagon: {
    position: 'relative',
    textAlign: 'left',
    marginBottom: `calc(${3 / width}vw + ${borderWidth * 2}px)`,
  },
  content: {
    position: 'absolute',
    top: '10px',
  },
  cssHexagon: {
    width: `${boardScreenPct / width / sqrtThree}vw`,
    height: `${boardScreenPct / width}vw`,
    backgroundColor: (props) => props.color,
    borderTop: border,
    borderBottom: border,
    '&:before, &:after': {
      backgroundColor: (props) => props.color,
      borderTop: border,
      borderBottom: border,
      content: '""',
      height: 'inherit',
      position: 'absolute',
      top: 0,
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
  const classes = useStyles({
    color: (hexagon.player && hexagon.player.color) || 'white',
  });

  return (
    <div className={classes.hexagon}>
      <div className={classes.cssHexagon}></div>
      <div className={classes.content}>{hexagon.name}</div>
    </div>
  );
};

export default Hexagon;
