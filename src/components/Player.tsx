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

const Player = ({ player }: { player: PlayerType }): JSX.Element => {
  if (!player) return <span>Waiting...</span>;
  return (
    <div>
      <Input size="large" value={player.name} prefix={<UserOutlined />} />
      <ColorPicker
        color={player.color}
        editable={player.editable}
        onChange={(color) => {
          console.log(color);
        }}
      />
    </div>
  );
};

export default Player;
