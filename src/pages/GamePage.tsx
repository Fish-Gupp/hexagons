import React, { useState } from 'react';
import Board, { BoardType } from '../components/Board';
import Layout from '../layouts/Layout';
import { Card, Col, Row } from 'antd';
import Player, { PlayerType } from '../components/Player';
import { height, width } from '../settings';
import { getTowerHeight } from '../components/Tower';
import { HexagonType } from '../components/Hexagon';

function GamePage(): JSX.Element {
  const [players] = useState(getNewPlayers());
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [board, setBoard] = useState(getNewBoard());

  return (
    <Layout>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card title={'Player 1'}>
            <Player
              player={{
                color: 'red',
                name: 'Player 1',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={'Hexagon 4D'}>
            <Board
              board={board}
              onClick={(index) => {
                const [newBoard, newHexagon] = dropHexagon(
                  board,
                  board.currentPlayer,
                  index
                );
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
                setCurrentPlayer(
                  players.indexOf(currentPlayer) === 0 ? players[1] : players[0]
                );
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title={'Player 2'}>
            <Player
              player={{
                color: 'green',
                name: 'Player 2',
              }}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default GamePage;

function dropHexagon(
  board: BoardType,
  player: PlayerType,
  towerIndex: number
): [BoardType, HexagonType | null] {
  const dropIndex = getDropIndex(board, towerIndex);
  const newBoard: BoardType = {
    ...board,
  };
  let hexagon: HexagonType | null = null;
  if (dropIndex < height) {
    hexagon = newBoard.layout[towerIndex][dropIndex];
    hexagon.player = player;
  }
  return [newBoard, hexagon];
}

function checkForWinner(
  board: BoardType,
  hexagon: HexagonType
): PlayerType | null {
  return null;
}

function getNewPlayers(): PlayerType[] {
  return [
    {
      color: 'red',
      name: 'Player 1',
    },
    {
      color: 'green',
      name: 'Player 2',
    },
  ];
}

function getNewBoard(): BoardType {
  const board: BoardType = {
    currentPlayer: {
      color: 'red',
      name: 'Player 1',
    },
    layout: [],
  };

  // creating hexagons
  for (let bi = 0; bi < width; bi++) {
    const tower = [];
    for (let ti = 0; ti < height; ti++) {
      const hexagon: HexagonType = {
        color: 'white',
        name: `${bi}:${ti}`,
        neighbors: {},
      };
      tower.push(hexagon);
    }
    board.layout.push(tower);
  }

  // setting refernces to neighboring hexagons
  for (let bi = 0; bi < width; bi++) {
    const tower = board.layout[bi];
    for (let ti = 0; ti < height; ti++) {
      const hexagon = tower[ti];
      if (ti < height - 1) {
        hexagon.neighbors.n = tower[ti + 1];
        if (bi < width - 1) {
          hexagon.neighbors.ne = board.layout[bi + 1][ti + 1];
        }
        if (bi > 0) {
          hexagon.neighbors.nw = board.layout[bi - 1][ti + 1];
        }
      }
      if (ti > 0) {
        hexagon.neighbors.s = tower[ti - 1];
        if (bi < width - 1) {
          hexagon.neighbors.se = board.layout[bi + 1][ti];
        }
        if (bi > 0) {
          hexagon.neighbors.sw = board.layout[bi - 1][ti];
        }
      }
    }
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
