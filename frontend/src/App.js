import './App.css';

//Router
import { Routes, Route } from "react-router-dom";
import React from 'react';

//Components
import {
  SignupContainer,
  SigninContainer,
  VotingContainer,
  VoteSuccessContainer
} from "./components/containers";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<SigninContainer />} />
        <Route exact path="/signup" element={<SignupContainer />} />
        <Route exact path="/voting" element={<VotingContainer />} />
        <Route exact path="/vote-success" element={<VoteSuccessContainer />} />
      </Routes>
    </div>
  )
}

export default App;