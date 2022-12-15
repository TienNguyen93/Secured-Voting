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
        childToParent,
        isClicked
    } = props;
    const [popupButton, setPopupButton] = useState(false);

    const duringPopup = popupButton ? " during-popup" : ""

    return (
        <div className="CandidateFormContainer">
            <Navbar childToParent={childToParent} />
            <div className={isClicked ? "candidate-body-navbar" : "candidate-body" + duringPopup}>
                <div className="candidate-body-wrap">
                    <div className="candidate-header">
                        <h1 style={{ margin: "10px 0px" }}>Candidates</h1>
                        <div className="button-wrap">
                            <button onClick={() => setPopupButton(true)}>New</button>
                            <button onClick={() => handleDelete()}>Remove</button>
                        </div>
                    </div>

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
                                    <tr key={candidate._id}>
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
            {popupButton &&
                <CandidateFormPopup setTrigger={setPopupButton}>
                    <form 
                        style={{ display: 'flex', flexDirection: 'column' }}
                        onSubmit={(e) => {
                            handleSubmit(e)
                            setPopupButton(false)
                        }}>
                        <h1 style={{marginBottom: '0.5rem'}}>Add Candidate</h1>
                        <label>Name: </label>
                        <input
                            type="text"
                            name="name"
                            required
                            onChange={(e) => handleChange(e)}
                            maxLength={20}
                            onKeyPress={(event) => {
                                if (!/[a-zA-Z\s]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignSelf: 'center' }}>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </CandidateFormPopup>
            }
        </div>
    );
};

export default CandidateView;
