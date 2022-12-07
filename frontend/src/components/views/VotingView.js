import React from "react";
import { Link } from "react-router-dom";

const VotingView = (props) => {
    const { handleSubmit, handleChange, handleSignOut, candidates } = props;

    return (
        <div>
            <div className="voting-page">
                <h1>Vote</h1>
                <div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div onChange={(e) => handleChange(e)}>
                            {candidates.map((candidate, index) => {
                                return (
                                    <div key={index} className="candidate">
                                        <input
                                            type="radio"
                                            name="candidate"
                                            value={candidate.name}
                                        />
                                        <label>{candidate.name}</label>
                                    </div>
                                );
                            })}
                        </div>

                        <div id="button-container">
                            <button>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div id="signOut">
                <Link to="/">
                    <button onClick={() => handleSignOut()}>Sign Out</button>
                </Link>
            </div>
        </div>
    );
};

export default VotingView;
