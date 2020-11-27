import React from 'react';
import { createUseStyles } from 'react-jss';
import { borderWidth, width } from '../settings';
import { PlayerType } from './Player';

export type HexagonType = {
  name: string;
  player?: PlayerType;
  color: string;
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

const Hexagon = ({ hexagon }: { hexagon: HexagonType }): JSX.Element => {
  const classes = useStyles({
    color: (hexagon.player && hexagon.player.color) || hexagon.color,
  });

  return (
    <div className={classes.hexagon}>
      <div className={classes.cssHexagon}></div>
      <div className={classes.content}></div>
    </div>
  );
};

export default Hexagon;
