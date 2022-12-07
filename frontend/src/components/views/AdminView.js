import React from "react";
import axios from 'axios'
import Navbar from "./navbar/Navbar";
import "./adminComponents/Admin.css";
import PieChart from "../containers/PieChartContainer";

const AdminView = (props) => {
    const { chain } = props;
    const chainArray = chain.chain;

    const handleStart = () => {
        const configuration = {
            method: 'post',
            url: 'http://localhost:5000/init',
        }
        axios(configuration)
            .then(result => {
                console.log('res here', result)
            }) 
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div>
            <Navbar />
            <div className="AdminContainer">
                <h1>Admin Dashboard</h1>
                <button onClick={handleStart}>Start Election</button>
                <PieChart />

                <h2>Blockchain</h2>
                <div className="blockchain-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Block</th>
                            <th>Voter ID</th>
                            <th>Voted Candidate</th>
                            <th>Timestamp</th>
                            <th>Previous Hash</th>
                            <th>Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(chainArray !== undefined) ?
                            chainArray.map((block, index) => {
                                if (index !== 0) {
                                    return (
                                        <tr>
                                            <td>{block.index}</td>
                                            <td>{block.voter}</td>
                                            <td>{block.candidate}</td>
                                            <td>{block.timestamp}</td>

                                            <td className="a">{block.prev_hash}</td>
                                            <td>{block.hash}</td>

                                            <td className="a">{block.prev_hash.slice(0,10) + "..."}</td>
                                            <td>{block.hash.slice(0,10) + "..."}</td>

                                        </tr>
                                    );
                                }
                            }) : console.log("failed")
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default AdminView;
