import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import "./adminComponents/Admin.css";
import PieChart from "../containers/PieChartContainer";

const AdminView = (props) => {
    const { chain } = props;

    return (
        <div>
            <Navbar />
            <div className="AdminContainer">
                <h1>Admin Dashboard</h1>

                <PieChart />

                <h2>Blockchain</h2>
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
                        {chain.map((block, index) => {
                            if (index !== 0) {
                                return (
                                    <tr>
                                        <td>{block.index}</td>
                                        <td>{block.voter}</td>
                                        <td>{block.candidate}</td>
                                        <td>{block.timestamp}</td>
                                        <td>{block.prev_hash}</td>
                                        <td>{block.hash}</td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminView;
