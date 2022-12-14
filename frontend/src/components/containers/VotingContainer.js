import { VotingView } from "../views";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VotingContainer = (props) => {
    const navigate = useNavigate();
    const { isVoted } = props;
    // Get candidates from database
    const [candidates, setCandidates] = useState([]);
    const [voterId, setVoterId] = useState("")
    const port = window.location.port;
    const [voter, setVoter] = useState([]);
    const [votedCandidate, setVotedCandidate] = useState("")

    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("item"));
        setVoterId(logged._id);
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/candidates").then((response) =>
            response.json().then((data) => {
                setCandidates(data);
            })
        );

        fetch("http://localhost:5000/voters").then((response) =>
            response.json().then((data) => {
                setVoter(data);
            })
        );
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleChange = (e) => {
        setVotedCandidate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let candidateId = ""
        let candidateCurrentVote = 0

        candidates.forEach(candidate => {
            if (votedCandidate === candidate.name) {
                console.log('match candy', typeof candidate._id, candidate)
                candidateId = candidate._id
                candidateCurrentVote = candidate.voteCount
            }
        })
        
        console.log(votedCandidate)

        const requestInit = {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({}),
        };
        fetch(`http://localhost:5${port.slice(1, 4)}/init`, requestInit)
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "You are now in network") {
                    const requestVote = {
                        method: "POST",
                        headers: { "content-Type": "application/json" },
                        body: JSON.stringify({
                            candidate: votedCandidate,
                            voter: voterId
                        }), 
                    }
                    fetch(`http://localhost:5${port.slice(1, 4)}/vote`, requestVote)
                        .then((response) => response.json())
                        .then((data) => console.log("post method vote", data))


                    const updateVote = {
                        method: "PUT",
                        headers: { "content-Type": "application/json" },
                        body: JSON.stringify({
                            voteCount: candidateCurrentVote + 1,
                        }), 
                    }
                    fetch(`http://localhost:5000/candidates/${candidateId}`, updateVote)
                        .then((response) => response.json())
                        .then((data) => console.log("update vote", data))
                        .catch((error) => console.log(error));
                    
                    voter.forEach(voter => {
                        if (voter._id === voterId) {
                            const updateVoter = {
                                method: "PUT",
                                headers: { "content-Type": "application/json" },
                                body: JSON.stringify({
                                    firstname: voter.firstname,
                                    lastname: voter.lastname,
                                    dob: voter.dob,
                                    ssn: voter.ssn,
                                    password: voter.password,
                                    email: voter.email,
                                    registered: voter.registered,
                                    voted: true,
                                }),
                            }
                            fetch(`http://localhost:5000/voters/${voterId}`, updateVoter)
                                .then((response) => response.json())
                                .then((data) => console.log("update voter", data))
                                .catch((error) => console.log(error));

                            isVoted();
                            
                            const updateVoterLocal = {
                                firstname: voter.firstname,
                                lastname: voter.lastname,
                                dob: voter.dob,
                                ssn: voter.ssn,
                                password: voter.password,
                                email: voter.email,
                                registered: voter.registered,
                                voted: true,
                                _id: voter._id,
                            }

                            localStorage.removeItem("item");
                            localStorage.setItem("item", JSON.stringify(updateVoterLocal));
                        }
                    })
                }
            })
            .catch((error) => console.log("error at /init", error));
        
        setTimeout(() => {
            navigate("/vote-success")   
        }, 3000);
    };

    return (
        <VotingView
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleSignOut={handleSignOut}
            candidates={candidates}
        />
    );
};

export default VotingContainer;
