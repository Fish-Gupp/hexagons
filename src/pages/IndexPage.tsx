import React from 'react';
import Layout from '../layouts/Layout';
import { roomCodeLength } from '../settings';

function IndexPage(): JSX.Element {
  const pathName = window.location.pathname;
  if (pathName.length !== roomCodeLength + 1) {
    window.location.pathname = newRoomCode(roomCodeLength);
    return <div>Redirecting...</div>;
  }

  return <Layout>Index!</Layout>;
}

export default IndexPage;

function newRoomCode(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
