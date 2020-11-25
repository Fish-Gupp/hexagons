import React from 'react';
import './App.css';
import Board from './components/Board';
import Footer from './components/Footer';
import Header from './components/Header';
import { roomCodeLength } from './settings';

function App(): JSX.Element {
  const pathName = window.location.pathname;
  if (pathName.length !== roomCodeLength + 1) {
    window.location.pathname = makePathName(roomCodeLength);
    return <div>Redirecting...</div>;
  }
  return (
    <div className="App">
      <Header />
      <Board />
      <Footer />
    </div>
  );
}

export default App;

function makePathName(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
