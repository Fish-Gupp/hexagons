import React, { useEffect, useRef, useState } from 'react';
import Board, { BoardType } from '../components/Board/Board';
import Layout from '../layouts/Layout';
import { Card, Col, Row, Spin } from 'antd';
import Player, { PlayerType } from '../components/Player';
import { createUseStyles } from 'react-jss';
import { useRoute } from 'wouter';
import ShareUrl from '../components/ShareUrl';
import createWebsocketConnection from '../gameFunctions/createWebSocketConnection';
import checkForWinner from '../gameFunctions/checkForWinner';
import dropHexagon from '../gameFunctions/dropHexagon';
import saveLocalPlayerInfo from '../gameFunctions/saveLocalPlayerInfo';
import debounce from 'lodash.debounce';

const useStyles = createUseStyles({
  turnIndicator: {
    backgroundColor: '#3bf43b',
    border: '2px solid #47d25d',
    borderRadius: '100%',
    display: 'inline-block',
    height: '1em',
    left: '.5em',
    position: 'relative',
    top: '.2em',
    width: '1em',
  },
  winner: {
    backgroundColor: '#f7f9fbcc',
    left: 0,
    padding: '10% 0',
    position: 'absolute',
    textAlign: 'center',
    top: '20%',
    width: '100%',
  },
});

function GamePage(): JSX.Element {
  const [localPlayer, setLocalPlayer] = useState<PlayerType | null>(null);
  const [board, setBoard] = useState<BoardType | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const boardRef = useRef(board);

  const classes = useStyles();

  const [_routeMatch, params] = useRoute('/:roomId');
  if (!_routeMatch || !params) return <></>;

  const roomId = params.roomId;

  const updateBoard = (newBoard: BoardType): void => {
    console.warn('updateBoard', newBoard);
    boardRef.current = newBoard;
    setBoard(newBoard);
    send({
      board: newBoard,
    });
  };

  const send = (
    data: { [id: string]: string | BoardType | PlayerType | null } | null
  ) => {
    if (!socketRef.current) return;
    if (!socketRef.current.OPEN) return;
    socketRef.current.send(
      JSON.stringify({
        ...data,
        groupIds: [roomId],
        to: {
          groupId: roomId,
        },
      })
    );
  };

  useEffect(() => {
    saveLocalPlayerInfo(localPlayer);
    const updateDebounced = debounce(() => {
      if (!boardRef.current) return;
      if (!localPlayer) return;
      const newBoard = {
        ...boardRef.current,
        player1: localPlayer.id === 1 ? localPlayer : boardRef.current.player1,
        player2: localPlayer.id === 2 ? localPlayer : boardRef.current.player2,
      };
      updateBoard(newBoard);
    }, 500);
    updateDebounced();
  }, [localPlayer]);

  useEffect(() => {
    createWebsocketConnection({
      boardRef,
      roomId,
      send,
      setBoard,
      setLocalPlayer,
      socketRef,
      updateBoard,
    });
  }, [roomId]);

  if (!board || !localPlayer) {
    return (
      <Layout>
        <Spin />
      </Layout>
    );
  }

  return (
    <Layout>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card
            title={
              <span>
                Player 1
                <span
                  className={
                    board.currentPlayerId === 1
                      ? classes.turnIndicator
                      : undefined
                  }
                ></span>
              </span>
            }
          >
            <Player
              player={localPlayer.id === 1 ? localPlayer : board.player1}
              setLocalPlayer={localPlayer.id === 1 ? setLocalPlayer : null}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={'Hexagon 4D'} bodyStyle={{ position: 'relative' }}>
            <Board
              board={board}
              localPlayer={localPlayer}
              onClick={(index) => {
                if (board.winner) return;
                if (!localPlayer) return;
                if (board.currentPlayerId !== localPlayer.id) return;
                const [newBoard, newHexagon] = dropHexagon(board, index);
                updateBoard(newBoard);
                if (newHexagon) {
                  const newWinner = checkForWinner(board, newHexagon);
                  if (newWinner) {
                    const winningBoard = {
                      ...board,
                      winner: newWinner,
                    };
                    updateBoard(winningBoard);
                  }
                }
              }}
            />
            {board.winner && (
              <div className={classes.winner}>
                <h1>Winner! {board.winner.name}</h1>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card
            title={
              <span>
                Player 2
                <span
                  className={
                    board.currentPlayerId === 2
                      ? classes.turnIndicator
                      : undefined
                  }
                ></span>
              </span>
            }
          >
            <Player
              player={localPlayer.id === 2 ? localPlayer : board.player2}
              setLocalPlayer={localPlayer.id === 2 ? setLocalPlayer : null}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <Card title={'Share URL'}>
            <ShareUrl />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default GamePage;
