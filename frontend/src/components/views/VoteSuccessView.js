import React from "react";
import checkmark from "../../image/checkmark.jpeg";
import PieChart from "../containers/PieChartContainer";
import { Link } from "react-router-dom";

const VoteSuccessView = (props) => {
    const { handleSignOut } = props;

    return (
        <div className="vote-success">
            <img className="checkmark" src={checkmark} alt={checkmark} />
            <h1 className="center">Success!</h1>
            <p className="center">Your vote has been cast.</p>

            <PieChart />
            
            <Link to="/">
                <button onClick={() => handleSignOut()}>Sign Out</button>
            </Link>
        </div>
    );
};

export default VoteSuccessView;
