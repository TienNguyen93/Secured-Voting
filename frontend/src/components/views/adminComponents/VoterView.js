import React, { useState } from "react";
import Navbar from "./../navbar/Navbar";
import "./Voter.css";
import CandidateFormPopup from "./CandidateFormPopup";

const VoterView = (props) => {
    const { handleChange, handleSubmit, handleEdit, handleSelect, selectedVoter, voters } =
        props;
    const [popupButton, setPopupButton] = useState(false);
    const [popupButtonEdit, setPopupButtonEdit] = useState(false);

    return (
        <div>
            <Navbar />
            <div className="VoterFormContainer">
                <h1>Voters</h1>
                <button onClick={() => setPopupButton(true)}>New</button>
                <button onClick={() => setPopupButtonEdit(true)}>Edit</button>

                {/* Popup form for new button */}
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
                        <h1>Add Voter</h1>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstname"
                            required
                            onChange={(e) => handleChange(e)}
                        />
                        <br />

                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            required
                            onChange={(e) => handleChange(e)}
                        />
                        <br />

                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            required
                            onChange={(e) => handleChange(e)}
                        />
                        <br />

                        <label>Social Security Number:</label>
                        <input
                            type="text"
                            name="ssn"
                            required
                            maxLength={9}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) => handleChange(e)}
                        />
                        <br />

                        <button type="submit">Submit</button>
                    </form>
                </CandidateFormPopup>
                
                {/* Popup form for edit button */}
                <CandidateFormPopup
                    trigger={popupButtonEdit}
                    setTrigger={setPopupButtonEdit}
                >
                    {voters.forEach((voter) => {
                        if (voter._id === selectedVoter) {
                            return (
                                <form onSubmit={(e) => {
                                    handleEdit(e);
                                    setPopupButtonEdit(false);
                                }}>
                                    <h1>Edit Voter</h1>
                                    <label>First Name:</label>
                                    <input type="text" name="firstname" placeholder={voter.firstname} onChange={(e) => handleChange(e)}/>

                                    <label>Last Name:</label>
                                    <input type="text" name="lastname" placeholder={voter.lastname} onChange={(e) => handleChange(e)}/>

                                    <label>Date of Birth:</label>
                                    <input type="date" name="dob" placeholder={voter.dob} onChange={(e) => handleChange(e)}/>

                                    <button type="submit">Submit</button>
                                </form>
                            )
                        }    
                    })}
                    
                </CandidateFormPopup>

                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Account Registered</th>
                            <th>Voted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voters.map((voter) => {
                            return (
                                <tr>
                                    <td>
                                        <input
                                            type="radio"
                                            name="id"
                                            value={voter._id}
                                            onClick={(e) => handleSelect(e)}
                                        />
                                    </td>
                                    <td>{voter._id}</td>
                                    <td>{voter.firstname}</td>
                                    <td>{voter.lastname}</td>
                                    <td>{voter.dob}</td>
                                    <td>{voter.registered ? "Yes" : "No"}</td>
                                    <td>{voter.voted ? "Yes" : "No"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VoterView;
