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
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
    const [user, setUser] = useState(null);

    // const handleLogin = () => setUser({ id: "1", name: "robin" });
    // const handleLogout = () => setUser(null);
    // console.log(localStorage.getItem("item"));
    // localStorage.setItem("item", JSON.stringify(values[0]))
    // console.log(localStorage);

    return (
        <div className="App">
            <Routes>
                <Route exact path="/" element={<SigninContainer />} />
                <Route exact path="/signup" element={<SignupContainer />} />

                {/* Voting Routes */}
                <Route element={<ProtectedRoute user={user} />}>
                    <Route exact path="/voting" element={<VotingContainer />} />
                    <Route
                        exact
                        path="/vote-success"
                        element={<VoteSuccessContainer />}
                    />
                </Route>

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
