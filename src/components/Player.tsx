import React from 'react';
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ColorPicker from './ColorPicker';

export type PlayerType = {
  id: number;
  name: string;
  color: string;
  editable: boolean;
} | null;

const Player = ({
  player,
  setLocalPlayer,
}: {
  player: PlayerType;
  setLocalPlayer: React.Dispatch<React.SetStateAction<PlayerType>> | null;
}): JSX.Element => {
  if (!player) return <span>Waiting...</span>;
  return (
    <div>
      <Input
        size="large"
        value={player.name}
        onChange={(e) => {
          if (!player.editable || !setLocalPlayer) return;
          const newPlayer = {
            ...player,
            name: e.target.value,
          };
          console.warn('name change', newPlayer);
          setLocalPlayer(newPlayer);
        }}
        prefix={<UserOutlined />}
      />
      <ColorPicker
        color={player.color}
        editable={player.editable}
        onChange={(color) => {
          if (!player.editable || !setLocalPlayer) return;
          const newPlayer = {
            ...player,
            color,
          };
          console.warn('color change', newPlayer);
          setLocalPlayer(newPlayer);
        }}
      />
    </div>
  );
};

export default Player;
