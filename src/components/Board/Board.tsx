import React, { useState } from 'react';
import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import getDropIndex from '../../gameFunctions/getDropIndex';
import { width } from '../../settings';
import { PlayerType } from '../Player';
import Tower, { TowerType } from './Tower';

export type BoardType = {
  player1: PlayerType;
  player2: PlayerType;
  currentPlayerId: number;
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
  localPlayer,
  onClick,
}: {
  board: BoardType;
  localPlayer: PlayerType;
  onClick?: (index: number) => void;
}): JSX.Element | null => {
  const classes = useStyles();
  const [localBoard, updateLocalBoard] = useState(board);
  if (!board) return null;
  if (!localPlayer) return null;

  const currentPlayer =
    board.currentPlayerId == 1 ? board.player1 : board.player2;

  useEffect(() => {
    updateLocalBoard(board);
  }, [board]);

  return (
    <div className={classes.background}>
      <div className={classes.board}>
        {localBoard.layout.map((tower, index) => (
          <Tower
            onMouseEnter={() => {
              if (!currentPlayer) return;
              if (currentPlayer.id !== localPlayer.id) return;
              const dropIndex = getDropIndex(localBoard, index);
              const newLocalBoard = {
                ...localBoard,
              };
              newLocalBoard.layout[index][dropIndex] = {
                ...newLocalBoard.layout[index][dropIndex],
                color: 'silver',
              };
              updateLocalBoard(newLocalBoard);
            }}
            onMouseLeave={() => {
              if (!currentPlayer) return;
              if (currentPlayer.id !== localPlayer.id) return;
              const dropIndex = getDropIndex(localBoard, index);
              const newLocalBoard = {
                ...localBoard,
              };
              newLocalBoard.layout[index][dropIndex] = {
                ...newLocalBoard.layout[index][dropIndex],
                color: 'white',
              };
              updateLocalBoard(newLocalBoard);
            }}
            onClick={() => {
              onClick && onClick(index);
            }}
            key={index}
            index={index}
            tower={tower}
            board={localBoard}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
