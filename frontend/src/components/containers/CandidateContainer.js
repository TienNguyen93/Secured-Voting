import { CandidateView } from "../views";
import React, { useEffect, useState } from "react";

const CandidateContainer = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/candidates").then((response) =>
            response.json().then((data) => {
                setCandidates(data);
            })
        );
    }, []);

    return (
      <CandidateView candidates={candidates}/>
    );
};

export default CandidateContainer;
