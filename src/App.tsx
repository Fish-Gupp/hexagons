import React from "react";
import "./App.css";
import Board from "./components/Board";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App(): JSX.Element {
  return (
    <div className="App">
      <Header />
      <Board />
      <Footer />
    </div>
  );
}

export default App;
