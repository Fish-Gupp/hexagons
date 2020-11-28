import { BoardType } from '../components/Board/Board';
import { PlayerType } from '../components/Player';
import getNewBoard from './getNewBoard';
import loadLocalPlayerInfo from './loadLocalPlayerInfo';
import { v4 as uuid } from 'uuid';

const createWebsocketConnection = async ({
  boardRef,
  roomId,
  send,
  setBoard,
  setLocalPlayer,
  socketRef,
  updateBoard,
}: {
  boardRef: React.MutableRefObject<BoardType | null>;
  roomId: string;
  send: (
    data: { [id: string]: string | BoardType | PlayerType | null } | null
  ) => void;
  setBoard: React.Dispatch<React.SetStateAction<BoardType | null>>;
  setLocalPlayer: React.Dispatch<React.SetStateAction<PlayerType | null>>;
  socketRef: React.MutableRefObject<WebSocket | null>;
  updateBoard: (board: BoardType) => void;
}): Promise<void> => {
  const connectionId = uuid();
  let sessionId: string | null = null;
  let isHost: boolean | undefined;
  const pingTimeoutMs = 10000;
  let lastPing = new Date().getTime();
  await fetch(`${process.env.REACT_APP_HEXAGON_API?.replace('ws', 'http')}`, {
    credentials: 'include',
  });
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
        const player1 = loadLocalPlayerInfo(1);
        setLocalPlayer(player1);
        updateBoard(getNewBoard(player1));
        isHost = true;
      } else {
        // is not group owner
        const player2 = loadLocalPlayerInfo(2);
        setLocalPlayer(player2);
        send({ player2 });
        isHost = false;
      }
    } else if (data.connectionId && isHost) {
      // send board init to player 2
      console.warn(boardRef.current);
      send({ board: boardRef.current });
    } else if (data.connectionId && isHost === false) {
      const player2 = loadLocalPlayerInfo(2);
      if (player2) {
        console.warn('player2', player2);
        send({ player2 });
      }
    }

    if (!sessionId || data.from === sessionId) return;

    if (data.board) {
      boardRef.current = data.board;
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
};

export default createWebsocketConnection;
