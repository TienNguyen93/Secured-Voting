import { AdminView } from "../views";
import React, { useEffect, useState } from "react";

const AdminContainer = () => {
    const [chain, setChain] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/chain").then((response) => 
            response.json().then((data) => {
                setChain(data);
            })
        );
    }, [chain])

    return ( 
        <AdminView chain={chain}/>
    );
};

export default AdminContainer;