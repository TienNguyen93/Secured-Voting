import { AdminView } from "../views";
import React, { useEffect, useState } from "react";
import axios from 'axios'

const AdminContainer = () => {
    const [chain, setChain] = useState([]);
    const [isRetrieved, setIsRetrieved] = useState(false)

    useEffect(() => {
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
    })

    useEffect(() => {
        const fetchData = async () => {
            const data = await (
                await fetch(
                    `http://localhost:5000/chain`
                )
            ).json()

            setChain(data)
        }
        fetchData()

        const timer = setTimeout(() => {    
            setIsRetrieved(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    console.log('admin container', chain, typeof chain)

    return (
        <>
            {isRetrieved
                ? <AdminView chain={chain} />
                : <h1 style={{ textAlign: 'center' }}>
                    Please wait for data to retrieve
                </h1>
            }
        </>
    );
};

export default AdminContainer;