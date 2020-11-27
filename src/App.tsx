import React from 'react';
import { Route, Switch } from 'wouter';
import IndexPage from './pages/IndexPage';
import GamePage from './pages/GamePage';
import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <Switch>
        <Route path={'/'} component={IndexPage} />
        <Route path={'/:roomCode'} component={GamePage} />
      </Switch>
    </div>
  );
}

export default App;
