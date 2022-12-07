import { VoteSuccessView } from "../views";
import React from "react";

const VoteSuccessContainer = () => {
    const handleSignOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <VoteSuccessView handleSignOut={handleSignOut}/>
    );
};

export default VoteSuccessContainer;
