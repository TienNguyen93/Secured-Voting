import { VoteSuccessView } from "../views";
import React from "react";
import { useNavigate } from "react-router-dom";

const VoteSuccessContainer = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.clear();
        // navigate("/");
        window.location.reload();
    };

    return (
        <VoteSuccessView handleSignOut={handleSignOut}/>
    );
};

export default VoteSuccessContainer;
