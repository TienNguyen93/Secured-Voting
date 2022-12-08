import { AdminView } from "../views";
// import AdminViewF from "../views/AdminViewF";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import Navbar from "../views/navbar/Navbar";
import "../views/adminComponents/Admin.css"

import PieChart from "../containers/PieChartContainer";

const AdminContainer = () => {
    const [isStarted, setIsStarted] = useState(false)

    const handleStart = () => {
        const configuration = {
            method: 'post',
            url: 'http://localhost:5000/init',
        }
        axios(configuration)
            .then(result => {
                console.log('res here', result)
                setIsStarted(true)
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
                <button onClick={handleStart}>Start election</button>
                <PieChart />

                <h2>Blockchain</h2>
                <div className="blockchain-table">
                    {isStarted
                        ? <AdminView />
                        :
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
                        </table>
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminContainer;