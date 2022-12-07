import React from "react";
import axios from 'axios'
import Navbar from "./navbar/Navbar";
import "./adminComponents/Admin.css";
import PieChart from "../containers/PieChartContainer";

const AdminView = ({ chain }) => {
    const chainArray = chain.chain;
    console.log('admin view chain', "& type is", typeof chainArray, chainArray)

    return (
        <div>
            <Navbar />
            <div className="AdminContainer">
                <h1>Admin Dashboard</h1>
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
                            {chainArray.map((block, i) => {
                                return [
                                    <tr key={i}>
                                        <td>{block.index}</td>
                                        <td>{block.voter}</td>
                                        <td>{block.candidate}</td>
                                        <td>{block.timestamp}</td>
                                        <td className="hash">
                                            {parseInt(block.prev_hash) === 0 
                                            ? block.prev_hash
                                            : block.prev_hash.slice(0, 10) + "..."
                                            }
                                            <span className="tooltip">{block.prev_hash}</span>
                                        </td>
                                        
                                        <td className="hash">
                                            {block.hash.slice(0, 10) + "..."}
                                            <span className="tooltip">{block.hash}</span>
                                        </td>
                                    </tr>
                                ]
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminView;
