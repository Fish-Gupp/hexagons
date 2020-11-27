import React from 'react';
import { createUseStyles } from 'react-jss';
import { width } from '../settings';
import { PlayerType } from './Player';
import Tower, { TowerType } from './Tower';

export type BoardType = {
  currentPlayer: PlayerType;
  winner?: PlayerType;
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
}: {
  board: BoardType;
  onClick: (index: number) => void;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.board}>
        {board.winner && <h1>Winner! {board.winner.name}</h1>}
        {board.layout.map((tower, index) => (
          <Tower
            onClick={() => {
              onClick(index);
            }}
            key={index}
            index={index}
            tower={tower}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
