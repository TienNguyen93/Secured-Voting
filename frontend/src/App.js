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
    const [user, setUser] = useState("");
    const [voters, setVoters] = useState([]);
    const loggedIn = window.localStorage.getItem("isLoggedIn");
    const currPath = window.location.pathname;

    if (user === "Admin") {
        window.localStorage.setItem("isAdmin", true);
    }

    const handler = (e) => {
        setUser(e.firstname);
    };

    useEffect(() => {
        fetch("http://localhost:5000/voters").then((response) =>
            response.json().then((data) => {
                setVoters(data);
            })
        );
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={
                                window.localStorage.getItem("item") === null
                            }
                            redirectPath={
                                loggedIn
                                    ? window.localStorage.getItem("isAdmin")
                                        ? "/admin"
                                        : JSON.parse(
                                              window.localStorage.getItem(
                                                  "item"
                                              )
                                          ).voted
                                        ? "/vote-success"
                                        : "/voting"
                                    : "/"
                            }
                        />
                    }
                >
                    <Route
                        exact
                        path="/"
                        element={<SigninContainer handler={handler} />}
                    />
                    <Route exact path="/signup" element={<SignupContainer />} />
                </Route>

                {/* Voting Routes */}
                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={
                                loggedIn &&
                                !window.localStorage.getItem("isAdmin") &&
                                !JSON.parse(window.localStorage.getItem("item"))
                                    .voted
                            }
                        />
                    }
                >
                    <Route exact path="/voting" element={<VotingContainer />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={
                                loggedIn &&
                                !window.localStorage.getItem("isAdmin") &&
                                JSON.parse(window.localStorage.getItem("item"))
                                    .voted
                            }
                        />
                    }
                >
                    <Route
                        exact
                        path="/vote-success"
                        element={<VoteSuccessContainer />}
                    />
                </Route>

                {/* Do we need this? */}
                <Route exact path="/voters" element={<ListVoters />} />

                {/* Admin Routes */}
                <Route
                    element={
                        <ProtectedRoute
                            isAllowed={
                                loggedIn &&
                                window.localStorage.getItem("isAdmin")
                            }
                        />
                    }
                >
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
                </Route>
            </Routes>
        </div>
    );
};

export default App;
