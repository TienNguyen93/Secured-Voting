import React from 'react';
import checkmark from '../../image/checkmark.jpeg';
// import PieChart from "../containers/PieChartContainer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PieChart from '../containers/PieChartContainer'
import axios from 'axios';

const VoteSuccessView = (props) => {
    const { handleSignOut } = props;
    const [candidates, setCandidates] = useState([]);
    const [isShowed, setIsShowed] = useState(false)

    const [infos, setInfos] = useState([])

    useEffect(() => {
        axios
            .get('http://localhost:5000/chain')
            .then(res => {
                setInfos(res.data.chain)
            })
    }, [])

    const retrieved = window.localStorage.getItem('item')
    const voter = JSON.parse(retrieved)
    const voterInfo = infos.filter(info => info.voter === voter._id)

    const Receipt = ({ voterInfo }) => {
        return (
            <div style={{ textAlign: 'center' }}>
                {voterInfo.map(info => (
                    <div key={info.index}>
                        <div className='info'>
                            <h3>First Name: </h3>
                            <p>{voter.firstname}</p>
                        </div>
                        <div className='info'>
                            <h3>Last Name: </h3>
                            <p>{voter.lastname}</p>
                        </div>
                        <div className='info'>
                            <h3>Your vote ID: </h3>
                            <p>{info.voter}</p>
                        </div>

                        <div className='info'>
                            <h3>Timestamp: </h3>
                            <p>{info.timestamp}</p>
                        </div>

                        <div className='info'>
                            <h3>Candidate: </h3>
                            <p>{info.candidate}</p>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

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

    candidates.forEach((candidate) => {
        data.push([candidate.name, candidate.voteCount]);
    })

    // const options = {
    //     title: "2022 Presidential Election",
    //     is3D: true,
    //     backgroundColor: "transparent",
    //     titleTextStyle: { fontSize: 20 },
    //     legend: { textStyle: { fontSize: 16 } },
    // };

    return (
        <div className="success-wrap">
            <div className='signout-button'>
                <Link to="/">
                    <button onClick={() => handleSignOut()}>Sign Out</button>
                </Link>
            </div>

            <div className="vote-success">
                <div className='success-col'>
                    <div className='checkmark-wrap'>
                        <img className="checkmark" src={checkmark} alt={checkmark} />
                    </div>
                    <div className='mess-wrap'>
                        <p>Your vote has been casted successfully!</p>
                    </div>
                    <div className="pie-mess-wrap">
                        <div style={{ marginBottom: '1rem' }}>
                            <p>Here is the current voting results:</p>
                        </div>

                        {isShowed
                            ? <PieChart />
                            : <h2>Chart is loading, please wait</h2>
                        }
                    </div>
                </div>

                {infos.length === 0
                    ? <div className='receipt'>
                        <div style={{textAlign: 'center'}}>
                            <h3 style={{margin: '1rem'}}>
                                Thank you for participating in the 2022 Presidential Election!
                            </h3>
                            <p style={{margin: '10px 0px'}}>Your vote matters to the future generation.</p>
                            <p>Keep calm and be anticipated to the upcoming election!</p>
                            
                        </div>
                    </div>
                    : <div className='receipt'>
                        <div style={{ margin: '1rem 0rem' }}>
                            <h1 style={{ margin: '1rem 0rem' }}>Vote Receipt</h1>
                            <Receipt voterInfo={voterInfo} />
                        </div>
                    </div>
                }
            </div>

        </div>
    );
};

export default VoteSuccessView;
