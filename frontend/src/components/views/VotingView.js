import React from "react";

const VotingView = (props) => {
    const { handleSubmit, candidates } = props;

    return (
        <div>
            <h1>Vote</h1>
            <div>
                <h2>President</h2>
                <form onSubmit={(e) => handleSubmit(e)}>
                    {/* {candidates.map(candidate => {
                        return (
                            <div>
                                <input type="radio" name={candidate} />
                                <label>{candidate}</label>
                            </div>
                        )
                    })} */}

                    <input
                        type="radio"
                        id="president1"
                        name="president"
                        value="president1"
                    />
                    <label htmlFor="president1">President 1</label>
                    <br />
                    <input
                        type="radio"
                        id="president2"
                        name="president"
                        value="president2"
                    />
                    <label htmlFor="president2">President 2</label>
                    <br />
                    <input
                        type="radio"
                        id="president3"
                        name="president"
                        value="president3"
                    />
                    <label htmlFor="president3">President 3</label>
                    <br />

                    <div className="button-container">
                        <button>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VotingView;
