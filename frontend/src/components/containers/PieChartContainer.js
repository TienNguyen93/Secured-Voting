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
    
    candidates.forEach((candidate) => {
        data.push([candidate.name, candidate.voteCount]);
    })

    const options = {
        title: "Current 2022 Presidential Voting Results",
        is3D: true,
        backgroundColor: "transparent",
        titleTextStyle: { fontSize: 20, position: 'top'},
        legend: {position: 'labeled', textStyle: {bold: true, fontSize: 14}},
        pieSliceText: 'none',
        chartArea: {top: 55, height: '65%'},
    };

    return (
        <PieChartView data={data} options={options} />
    );
};

export default PieChartContainer;
