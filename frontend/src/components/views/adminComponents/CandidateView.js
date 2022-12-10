import React, { useState } from "react";
import Navbar from "./../navbar/Navbar";
import "./Candidate.css";
import CandidateFormPopup from "./CandidateFormPopup";

const CandidateView = (props) => {
    const {
        handleChange,
        handleSubmit,
        handleSelect,
        handleDelete,
        candidates,
    } = props;
    const [popupButton, setPopupButton] = useState(false);

    return (
        <div>
            <Navbar />
            <div className="CandidateFormContainer">
                <h1>Candidates</h1>

                <button onClick={() => setPopupButton(true)}>New</button>
                <button onClick={() => handleDelete()}>Remove</button>
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
                            maxLength={20}
                            onKeyPress={(event) => {
                                if (!/[a-zA-Z]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </CandidateFormPopup>

                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((candidate) => {
                            return (
                                <tr>
                                    <td>
                                        <input
                                            type="radio"
                                            name="id"
                                            value={candidate._id}
                                            onClick={(e) => handleSelect(e)}
                                        />
                                    </td>
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
