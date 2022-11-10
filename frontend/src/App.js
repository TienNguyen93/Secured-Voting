import './App.css';

//Router
import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';

//Components
import {
  SignupContainer,
  SigninContainer,
  VotingContainer,
  VoteSuccessContainer,
  AdminContainer
} from "./components/containers";

import ListVoters from './components/ListVoters';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<SigninContainer />} />
        <Route exact path="/signup" element={<SignupContainer />} />
        <Route exact path="/voting" element={<VotingContainer />} />
        <Route exact path="/vote-success" element={<VoteSuccessContainer />} />
        <Route exact path="/voters" element={<ListVoters />}/>
        <Route exact path="/admin" element={<AdminContainer />} />
      </Routes>
    </div>
  )
}

export default App;