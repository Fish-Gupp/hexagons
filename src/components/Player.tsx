import React from 'react';
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ColorPicker from './ColorPicker';

export type PlayerType = {
  name: string;
  color: string;
};

const Player = ({ player }: { player: PlayerType }): JSX.Element => {
  return (
    <div>
      <Input size="large" value={player.name} prefix={<UserOutlined />} />
      <ColorPicker
        color={player.color}
        onChange={(color) => {
          console.log(color);
        }}
      />
    </div>
  );
};

export default Player;
