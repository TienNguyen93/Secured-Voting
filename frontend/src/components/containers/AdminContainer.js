import { AdminView } from "../views";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import Navbar from "../views/navbar/Navbar";
import "../views/adminComponents/Admin.css"

import PieChart from "../containers/PieChartContainer";
import BarChart from "./BarChart";

const AdminContainer = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [isClicked, setIsClicked] = useState(null)

    const [chain, setChain] = useState([])

    useEffect(() => {
        if (window.localStorage !== undefined) {
            const data = window.localStorage.getItem('chain')
            if (data) {
                setChain(JSON.parse(data))
            }
        }
    }, [])

    const handleStart = () => {
        axios
            .post('http://localhost:5000/init')
            .then(res => {
                console.log('res', res)
                return axios.get('http://localhost:5000/chain')
            })
            .then(res => {
                console.log('res 2', res.data.chain)
                // setIsStarted(true)
                localStorage.setItem('chain', JSON.stringify(res.data.chain))
                setChain(res.data.chain)
            })
    }

    // const handleStart = () => {
    //     const configuration = {
    //         method: 'post',
    //         url: 'http://localhost:5000/init',
    //     }
    //     axios(configuration)
    //         .then(result => {
    //             console.log('res here', result)
    //             setIsStarted(true)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })
    // }

    const childToParent = (data) => {
        setIsClicked(data)
    }

    // useEffect(() => {
    //     if (window.localStorage !== undefined) {
    //         const data = window.localStorage.getItem('chain')
    //         if (data) {
    //             setChain(JSON.parse(data))
    //         }
    //         setChain([])
    //     }
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            const data = await (
                await fetch(
                    `http://localhost:5000/chain`
                )
            ).json()
            setChain(data.chain)
        }

        const timer = setTimeout(() => {
            fetchData()
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="AdminContainer">
            <Navbar childToParent={childToParent} />

            <div className={isClicked ? "admin-body-navbar" : "admin-body"}>
                <div className="admin-header">
                    <div className="admin-header-title">
                        <h1>Dashboard</h1>
                        <p>Welcome to your dashboard</p>
                    </div>
                    <div className="admin-header-button">
                        <button onClick={handleStart}>Start election</button>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <div className="pie-container">
                        <PieChart />
                    </div>
                    <div className="pie-container-sec">
                        <BarChart />
                    </div>
                </div>

                {/* <div className="pie-container">
                    <PieChart />
                </div> */}

                <div className="block-wrap-isStarted">
                    <h1>Blockchain</h1>
                    <div className="blockchain-table">
                        <AdminView chain={chain} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContainer;