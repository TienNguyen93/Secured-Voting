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
  AdminContainer,
  CandidateContainer,
  VoterContainer
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

        {/* Admin Routes */}
        <Route exact path="/admin" element={<AdminContainer />} />
        <Route exact path="/admin/candidates" element={<CandidateContainer />} />
        <Route exact path="/admin/voters" element={<VoterContainer />} />
      </Routes>
    </div>
  )
}

export default App;