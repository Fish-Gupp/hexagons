import React from 'react';
import { createUseStyles } from 'react-jss';
import { width } from '../../settings';
import { PlayerType } from '../Player';
import Tower, { TowerType } from './Tower';

export type BoardType = {
  player1: PlayerType;
  player2: PlayerType;
  currentPlayer: PlayerType;
  winner: PlayerType;
  layout: TowerType[];
};

const marginLeft = `${50 / width / Math.sqrt(3)}%`;
const useStyles = createUseStyles({
  background: {
    backgroundImage: 'url(background.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    padding: '4% 6% 0% 7%',
    paddingBottom: '12%',
  },
  board: {
    marginLeft: `${marginLeft}`,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    width: `calc (100% - ${marginLeft})`,
  },
});

const Board = ({
  board,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  board: BoardType;
  onClick?: (index: number) => void;
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: (index: number) => void;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.board}>
        {board.layout.map((tower, index) => (
          <Tower
            onMouseEnter={() => {
              onMouseEnter && onMouseEnter(index);
            }}
            onMouseLeave={() => {
              onMouseLeave && onMouseLeave(index);
            }}
            onClick={() => {
              onClick && onClick(index);
            }}
            key={index}
            index={index}
            tower={tower}
            board={board}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
