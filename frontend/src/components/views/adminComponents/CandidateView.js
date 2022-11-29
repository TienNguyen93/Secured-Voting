import React, { useState } from "react";
import Navbar from "./../navbar/Navbar";
import "./Candidate.css";
import CandidateFormPopup from "./CandidateFormPopup";

const CandidateView = (props) => {
    const { handleChange, handleSubmit, candidates } = props;
    const [popupButton, setPopupButton] = useState(false);

    return (
        <div>
            <Navbar />
            <div className="CandidateFormContainer">
                <h1>Candidates</h1>

                <button onClick={() => setPopupButton(true)}>New</button>
                <CandidateFormPopup
                    trigger={popupButton}
                    setTrigger={setPopupButton}
                >
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e);
                            setPopupButton(false);
                        }}
                    >
                        <h1>Add Candidate</h1>
                        <label>Name: </label>
                        <input
                            type="text"
                            name="name"
                            required
                            onChange={(e) => handleChange(e)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </CandidateFormPopup>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((candidate) => {
                            return (
                                <tr>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.voteCount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CandidateView;
