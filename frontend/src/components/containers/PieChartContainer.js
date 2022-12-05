import { PieChartView } from "../views";
import React, { useEffect, useState } from "react";

const PieChartContainer = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/candidates").then((response) =>
            response.json().then((data) => {
                setCandidates(data);
            })
        );
    }, []);

    const data = [
        ["Candidate", "Votes"],
    ];
    
    candidates.map((candidate) => {
        data.push([candidate.name, candidate.voteCount]);
    })

    const options = {
        title: "Voting Results",
        is3D: true,
        backgroundColor: "transparent",
        titleTextStyle: { fontSize: 20 },
        legend: { textStyle: { fontSize: 16 } },
    };

    return (
        <PieChartView data={data} options={options} />
    );
};

export default PieChartContainer;
