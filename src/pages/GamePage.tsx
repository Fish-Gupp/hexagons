import React, { useEffect, useRef, useState } from 'react';
import Board, { BoardType } from '../components/Board/Board';
import Layout from '../layouts/Layout';
import { Card, Col, Row, Spin } from 'antd';
import Player, { PlayerType } from '../components/Player';
import { height, width } from '../settings';
import { getTowerHeight } from '../components/Board/Tower';
import { HexagonType, Cardinal } from '../components/Board/Hexagon';
import { createUseStyles } from 'react-jss';
import { useRoute } from 'wouter';
import ShareUrl from '../components/ShareUrl';
import { v4 as uuid } from 'uuid';

const useStyles = createUseStyles({
  winner: {
    backgroundColor: '#f7f9fbcc',
    left: 0,
    padding: 'calc(25% + 46px) 0',
    position: 'absolute',
    textAlign: 'center',
    top: 0,
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
    boardRef.current = newBoard;
    setBoard(newBoard);
    send({
      board: newBoard,
    });
  };

  const send = (data: any) => {
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
  }, [localPlayer]);

  useEffect(() => {
    const connectionId = uuid();
    let sessionId: string | null = null;
    const pingTimeoutMs = 10000;
    let lastPing = new Date().getTime();
    const socket = new WebSocket(`${process.env.REACT_APP_HEXAGON_API}`);
    socketRef.current = socket;
    const close = () => {
      clearInterval(intervalRef);
      socket.close();
    };
    const intervalRef = setInterval(() => {
      if (!socket.OPEN) {
        close();
      }
      if (new Date().getTime() > lastPing + pingTimeoutMs) {
        close();
      }
      send({ message: 'ping' });
    }, 5000);
    socket.addEventListener('open', () => {
      console.log('websocket open');
      send({ connectionId });
    });
    socket.addEventListener('message', (event) => {
      lastPing = new Date().getTime();
      try {
        JSON.parse(event.data);
      } catch {
        return;
      }
      const data = JSON.parse(event.data);
      if (data.to.groupId != roomId) return;
      console.log('websocket data', data);

      if (data.connectionId === connectionId) {
        // initial sync message
        sessionId = data.from;
        if (data.from === data.groupAuthorities[0]) {
          // is group owner
          const player = loadLocalPlayerInfo(1);
          setLocalPlayer(player);
          updateBoard(getNewBoard(player));
        } else {
          // is not group owner
          const player2 = loadLocalPlayerInfo(2);
          setLocalPlayer(player2);
          send({ player2 });
        }
      } else if (data.connectionId) {
        console.warn(boardRef.current);
        send({ board: boardRef.current });
      }

      if (!sessionId || data.from === sessionId) return;

      if (data.board) {
        setBoard(data.board);
      }

      if (data.player2 && data.from !== sessionId) {
        if (!boardRef.current) return;
        const newBoard: BoardType = {
          ...boardRef.current,
          player2: data.player2,
        };
        updateBoard(newBoard);
      }
    });
  }, [roomId]);

  if (!board) {
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
          <Card title={'Player 1'}>
            <Player player={board.player1} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={'Hexagon 4D'} bodyStyle={{ position: 'relative' }}>
            <Board
              board={board}
              onMouseEnter={(towerIndex) => {
                const tower = board.layout[towerIndex];
                getDropIndex(board, towerIndex);
              }}
              onMouseLeave={(towerIndex) => {
                const tower = board.layout[towerIndex];
                getDropIndex(board, towerIndex);
              }}
              onClick={(index) => {
                if (board.winner) return;
                if (!board.currentPlayer) return;
                if (!localPlayer) return;
                if (board.currentPlayer.id !== localPlayer.id) return;
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
          <Card title={'Player 2'}>
            <Player player={board.player2} />
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

function dropHexagon(
  board: BoardType,
  towerIndex: number
): [BoardType, HexagonType | null] {
  const dropIndex = getDropIndex(board, towerIndex);
  if (dropIndex >= height) {
    return [board, null];
  }
  const newBoard: BoardType = {
    ...board,
    currentPlayer:
      board.currentPlayer && board.currentPlayer.id === 1
        ? board.player2
        : board.player1,
  };
  const hexagon = newBoard.layout[towerIndex][dropIndex];
  hexagon.player = board.currentPlayer;
  return [newBoard, hexagon];
}

function checkForWinner(board: BoardType, hexagon: HexagonType): PlayerType {
  if (!hexagon.player) return null;

  function nextagon(
    board: BoardType,
    hexagon: HexagonType,
    d1: Cardinal
  ): HexagonType {
    const east = board.layout[hexagon.towerIndex + 1];
    const west = board.layout[hexagon.towerIndex - 1];
    switch (d1) {
      case 'n':
        return (
          board.layout[hexagon.towerIndex][hexagon.hexagonIndex + 1] ||
          undefined
        );
      case 's':
        return (
          board.layout[hexagon.towerIndex][hexagon.hexagonIndex - 1] ||
          undefined
        );
      case 'ne':
        return (
          (east && east[hexagon.hexagonIndex + hexagon.isOdd]) || undefined
        );
      case 'nw':
        return (
          (west && west[hexagon.hexagonIndex + hexagon.isOdd]) || undefined
        );
      case 'se':
        return (
          (east && east[hexagon.hexagonIndex - 1 + hexagon.isOdd]) || undefined
        );
      case 'sw':
        return (
          (west && west[hexagon.hexagonIndex - 1 + hexagon.isOdd]) || undefined
        );
    }
  }

  function matchesInDirection(
    board: BoardType,
    hexagon: HexagonType,
    d1: Cardinal
  ): number {
    let count = 0;
    let testagon = nextagon(board, hexagon, d1);
    while (
      testagon &&
      testagon.player &&
      hexagon.player &&
      testagon.player.id === hexagon.player.id
    ) {
      count++;
      testagon = nextagon(board, testagon, d1);
    }
    return count;
  }

  function isFour(
    board: BoardType,
    hexagon: HexagonType,
    d1: Cardinal,
    d2: Cardinal
  ): boolean {
    if (
      matchesInDirection(board, hexagon, d1) +
        matchesInDirection(board, hexagon, d2) +
        1 >=
      4
    ) {
      return true;
    }
    return false;
  }

  if (isFour(board, hexagon, 'n', 's')) return hexagon.player;
  if (isFour(board, hexagon, 'ne', 'sw')) return hexagon.player;
  if (isFour(board, hexagon, 'nw', 'se')) return hexagon.player;
  return null;
}

function getNewBoard(player1: PlayerType): BoardType {
  const board: BoardType = {
    currentPlayer: player1,
    layout: [],
    player1,
    player2: null,
    winner: null,
  };

  // creating hexagons
  for (let towerIndex = 0; towerIndex < width; towerIndex++) {
    const tower = [];
    for (let hexagonIndex = 0; hexagonIndex < height; hexagonIndex++) {
      const hexagon: HexagonType = {
        color: 'white',
        hexagonIndex,
        isOdd: towerIndex % 2,
        name: `${towerIndex}:${hexagonIndex}`,
        towerIndex,
      };
      tower.push(hexagon);
    }
    board.layout.push(tower);
  }

  return board;
}

function getDropIndex(board: BoardType, towerIndex: number): number {
  const oddOffset = towerIndex % 2;
  const tower = board.layout[towerIndex];
  let height = getTowerHeight(tower);

  if (towerIndex > 0) {
    const leftTower = board.layout[towerIndex - 1];
    const leftTowerHeight = getTowerHeight(leftTower) - oddOffset;
    height = Math.max(height, leftTowerHeight);
  }

  if (towerIndex < width - 1) {
    const rightTower = board.layout[towerIndex + 1];
    const rightTowerHeight = getTowerHeight(rightTower) - oddOffset;
    height = Math.max(height, rightTowerHeight);
  }

  return height;
}

function saveLocalPlayerInfo(player: PlayerType): void {
  localStorage.setItem('hexagon-player', JSON.stringify(player));
}

function loadLocalPlayerInfo(playerNumber: number): PlayerType {
  try {
    const playerString = localStorage.getItem('hexagon-player');
    if (playerString) {
      const player: PlayerType = JSON.parse(playerString);
      if (player)
        return {
          color: player.color || playerNumber === 1 ? 'red' : 'green',
          editable: true,
          id: playerNumber,
          name: player.name,
        };
    }
  } catch {
    // empty
  }
  return {
    color: playerNumber === 1 ? 'red' : 'green',
    editable: true,
    id: playerNumber,
    name: `Player ${playerNumber}`,
  };
}
