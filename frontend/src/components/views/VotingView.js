import React from "react";

const VotingView = (props) => {
    const { handleSubmit, handleChange, candidates } = props;

    return (
        <div className="voting-page">
            <h1 >Vote</h1>
            <div>
                {/* <h2>President</h2> */}
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

                    <div className="button-container">
                        <button>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VotingView;
