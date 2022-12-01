import React, { useState } from "react";
import Navbar from "./../navbar/Navbar";
import "./Voter.css";
import CandidateFormPopup from "./CandidateFormPopup";

const VoterView = (props) => {
    const { handleChange, handleSubmit, voters } = props;
    const [popupButton, setPopupButton] = useState(false);

    return (
        <div>
            <Navbar />
            <div className="VoterFormContainer">
                <h1>Voters</h1>
                <button onClick={() => setPopupButton(true)}>New</button>
                <button>Remove</button>
                <button>Edit</button>

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

                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
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

                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
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
                                        />
                                    </td>
                                    <td>{voter.firstname}</td>
                                    <td>{voter.lastname}</td>
                                    <td>{voter.email}</td>
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
