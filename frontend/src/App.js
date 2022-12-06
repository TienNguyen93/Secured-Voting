import "./App.css";
import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

//Components
import {
    SignupContainer,
    SigninContainer,
    VotingContainer,
    VoteSuccessContainer,
    AdminContainer,
    CandidateContainer,
    VoterContainer,
} from "./components/containers";
import ListVoters from "./components/ListVoters";

const App = () => {
    const [user, setUser] = React.useState(null);

    const handleLogin = () => setUser({ id: "1", name: "robin" });
    const handleLogout = () => setUser(null);

    return (
        <div className="App">
            {user ? (
                <button onClick={handleLogout}>Sign Out</button>
            ) : (
                <button onClick={handleLogin}>Sign In</button>
            )}

            <Routes>
                <Route exact path="/" element={<SigninContainer />} />
                <Route exact path="/signup" element={<SignupContainer />} />
                <Route exact path="/voting" element={<VotingContainer user={user}/>} />
                <Route
                    exact
                    path="/vote-success"
                    element={<VoteSuccessContainer />}
                />

                {/* Do we need this? */}
                <Route exact path="/voters" element={<ListVoters />} />

                {/* Admin Routes */}
                <Route exact path="/admin" element={<AdminContainer />} />
                <Route
                    exact
                    path="/admin/candidates"
                    element={<CandidateContainer />}
                />
                <Route
                    exact
                    path="/admin/voters"
                    element={<VoterContainer />}
                />
            </Routes>
        </div>
    );
};

export default App;
