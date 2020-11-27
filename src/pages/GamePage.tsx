import React, { useCallback, useEffect, useState } from 'react';
import Board, { BoardType } from '../components/Board/Board';
import Layout from '../layouts/Layout';
import { Card, Col, Row } from 'antd';
import Player, { PlayerType } from '../components/Player';
import { height, width } from '../settings';
import { getTowerHeight } from '../components/Board/Tower';
import { HexagonType, NeighborIndex } from '../components/Board/Hexagon';
import { createUseStyles } from 'react-jss';
import { useRoute } from 'wouter';
import ShareUrl from '../components/ShareUrl';

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
  const player1: PlayerType = {
    color: 'red',
    editable: true,
    id: 1,
    name: 'Player 1',
  };
  const player2: PlayerType | null = null;
  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [board, setBoard] = useState(getNewBoard(player1));
  const classes = useStyles();
  const [_routeMatch, params] = useRoute('/:roomId');
  if (!params) return <></>;
  const roomId = params.roomId;

  useEffect(() => {
    console.log(roomId);
    const socket = new WebSocket(`ws://${process.env.REACT_APP_HEXAGON_API}`);
    socket.addEventListener('open', function (event) {
      console.log('websocket open');
    });
    socket.addEventListener('message', function (event) {
      console.log(event.data);
    });
  }, [roomId]);

  return (
    <Layout>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card title={'Player 1'}>
            {roomId}
            <Player player={player1} />
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
              }}
              onClick={(index) => {
                if (board.winner) return;
                if (board.currentPlayer.id !== currentPlayer.id) return;
                const [newBoard, newHexagon] = dropHexagon(board, index);
                setBoard(newBoard);
                if (newHexagon) {
                  const newWinner = checkForWinner(board, newHexagon);
                  if (newWinner) {
                    const newBoard = {
                      ...board,
                      winner: newWinner,
                    };
                    setBoard(newBoard);
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
            {player2 ? <Player player={player2} /> : <span>Waiting...</span>}
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
  };
  const hexagon = newBoard.layout[towerIndex][dropIndex];
  hexagon.player = board.currentPlayer;
  return [newBoard, hexagon];
}

function checkForWinner(
  board: BoardType,
  hexagon: HexagonType
): PlayerType | null {
  if (!hexagon.player) return null;

  function matchesInDirection(hexagon: HexagonType, d1: NeighborIndex): number {
    let count = 0;
    let testagon = hexagon.neighbors[d1];
    while (
      testagon &&
      testagon.player &&
      hexagon.player &&
      testagon.player.id === hexagon.player.id
    ) {
      count++;
      testagon = testagon.neighbors[d1];
    }
    return count;
  }

  function isFour(
    hexagon: HexagonType,
    d1: NeighborIndex,
    d2: NeighborIndex
  ): boolean {
    if (
      matchesInDirection(hexagon, d1) + matchesInDirection(hexagon, d2) + 1 >=
      4
    ) {
      return true;
    }
    return false;
  }

  if (isFour(hexagon, 'n', 's')) return hexagon.player;
  if (isFour(hexagon, 'ne', 'sw')) return hexagon.player;
  if (isFour(hexagon, 'nw', 'se')) return hexagon.player;
  return null;
}

function getNewBoard(player: PlayerType): BoardType {
  const board: BoardType = {
    currentPlayer: player,
    layout: [],
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
        neighbors: {},
        towerIndex,
      };
      tower.push(hexagon);
    }
    board.layout.push(tower);
  }

  // setting references to neighboring hexagons
  board.layout.forEach((tower) => {
    tower.forEach((hexagon) => {
      const east = board.layout[hexagon.towerIndex + 1];
      const west = board.layout[hexagon.towerIndex - 1];
      hexagon.neighbors.n =
        board.layout[hexagon.towerIndex][hexagon.hexagonIndex + 1] || undefined;
      hexagon.neighbors.s =
        board.layout[hexagon.towerIndex][hexagon.hexagonIndex - 1] || undefined;
      hexagon.neighbors.ne =
        (east && east[hexagon.hexagonIndex + hexagon.isOdd]) || undefined;
      hexagon.neighbors.nw =
        (west && west[hexagon.hexagonIndex + hexagon.isOdd]) || undefined;
      hexagon.neighbors.se =
        (east && east[hexagon.hexagonIndex - 1 + hexagon.isOdd]) || undefined;
      hexagon.neighbors.sw =
        (west && west[hexagon.hexagonIndex - 1 + hexagon.isOdd]) || undefined;
    });
  });
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
