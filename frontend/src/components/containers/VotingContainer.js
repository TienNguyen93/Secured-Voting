import { VotingView } from "../views";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VotingContainer = () => {
    const navigate = useNavigate();
    // Get candidates from database
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/candidates").then((response) =>
            response.json().then((data) => {
                setCandidates(data);
            })
        );
    }, []);

    const handleSubmit = (e) => {

        navigate("/vote-success");
    }

    return (
        <VotingView handleSubmit={handleSubmit} candidates={candidates}/>
    );
}

export default VotingContainer;
