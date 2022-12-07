import React from 'react';
import checkmark from '../../image/checkmark.jpeg';
// import PieChart from "../containers/PieChartContainer";
import { PieChartView } from "../views";
import { useEffect, useState } from "react";

const VoteSuccessView = () => {
    const [candidates, setCandidates] = useState([]);
    const [isShowed, setIsShowed] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const data = await (
                await fetch(
                    "http://localhost:5000/candidates"
                )
            ).json()

            // set state when the data received
            setCandidates(data)
        }

        const timer = setTimeout(() => {
            fetchData()
            setIsShowed(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

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

    console.log('candis', candidates)

    return (
        <div className="vote-success">
            <img className="checkmark" src={checkmark} alt={checkmark} />
            <h1 className="center">Success!</h1>
            <p className="center">Your vote has been cast.</p>

            {isShowed
                ? <PieChartView data={data} options={options} />
                : <h1>Chart is loading, please wait</h1>
            }
            
            <div>
                <button>Sign Out</button>
            </div>
        </div>
    )
}

export default VoteSuccessView;