import { VotingView } from "../views";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VotingContainer = () => {
    const navigate = useNavigate();
    // Get candidates from database
    const [candidates, setCandidates] = useState([]);
    const [voterId, setVoterId] = useState("")
    
    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("item"))
        setVoterId(logged._id)
    },[])

    let votedCandidate = "";


    useEffect(() => {
        fetch("http://localhost:5000/candidates").then((response) =>
            response.json().then((data) => {
                setCandidates(data);
            })
        );
    }, []);

    const handleChange = (e) => {
        votedCandidate = e.target.value;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("candidate?", votedCandidate)

        const requestInit = {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({}),
        }
        fetch(`http://localhost:5000/init`, requestInit)
            .then((response) => response.json())
            .then(data => {
                if (data.message === "You are now in network") {
                    const requestVote = {
                        method: "POST",
                        headers: { "content-Type": "application/json" },
                        body: JSON.stringify({
                            candidate: votedCandidate,
                            voter: voterId
                        }), 
                    }

                    fetch(`http://localhost:5000/vote`, requestVote)
                        .then((response) => response.json())
                        .then((data) => console.log("post method vote", data))
                }
            })
            .catch((error) => console.log("error at /init", error))

        navigate("/vote-success");
    }

    return (
        <VotingView handleSubmit={handleSubmit} handleChange={handleChange} candidates={candidates} />
    );
}

export default VotingContainer;
