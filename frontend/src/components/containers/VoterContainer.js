import { VoterView } from "../views";
import React, { useEffect, useState } from "react";

const VoterContainer = () => {
    const [voters, setVoters] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/voters")
            .then((response) => response.json()
            .then((data) => {
            setVoters(data);
            })
        );
    }, [voters]);

    return (
        <VoterView voters={voters}/>
    );
};

export default VoterContainer;