import React from 'react';
import { Route, Switch } from 'wouter';
import { Slide, ToastContainer } from 'react-toastify';
import IndexPage from './pages/IndexPage';
import GamePage from './pages/GamePage';

import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <Switch>
        <Route path={'/'} component={IndexPage} />
        <Route path={'/:roomId'} component={GamePage} />
      </Switch>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        transition={Slide}
      />
    </div>
  );
}

export default App;
