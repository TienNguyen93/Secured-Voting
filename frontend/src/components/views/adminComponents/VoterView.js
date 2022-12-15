import React, { useState } from "react";
import Navbar from "./../navbar/Navbar";
import "./Voter.css";
import CandidateFormPopup from "./CandidateFormPopup";

const VoterView = (props) => {
    const {
        handleChange,
        handleSubmit,
        handleEdit,
        handleSelect,
        selectedVoter,
        voters,
        childToParent,
        isClicked
    } = props;
    const [popupButton, setPopupButton] = useState(false);
    const [popupButtonEdit, setPopupButtonEdit] = useState(false);

    const duringPopup = popupButton || popupButtonEdit ? " during-popup" : ""

    return (
        <div className="VoterFormContainer">
            <Navbar childToParent={childToParent} />
            <div className={isClicked ? "voter-body-navbar" : "voter-body" + duringPopup}>
                <div className="voter-body-wrap">
                    <div className="voter-header">
                        <h1 style={{ margin: "10px 0px" }}>Voters</h1>
                        <div className="button-wrap">
                            <button onClick={() => setPopupButton(true)}>New</button>
                            <button style={{width: '11em'}} onClick={() => setPopupButtonEdit(true)}>
                                Select a voter to edit
                            </button>
                        </div>
                    </div>

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
                                    <tr key={voter._id}>
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
            {/* Popup form for new button */}
            {popupButton &&
                <CandidateFormPopup setTrigger={setPopupButton}>
                    <form
                        style={{ display: 'flex', flexDirection: 'column' }}
                        onSubmit={(e) => {
                            handleSubmit(e)
                            setPopupButton(false)
                        }}>
                        <h1 style={{ marginBottom: '0.5rem' }}>Add Voter</h1>
                        <label>First Name: </label>
                        <input
                            type="text"
                            name="firstname"
                            required
                            onChange={(e) => handleChange(e)}
                            maxLength={20}
                            onKeyPress={(event) => {
                                if (!/[a-zA-Z]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                        <br />

                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            required
                            onChange={(e) => handleChange(e)}
                            maxLength={20}
                            onKeyPress={(event) => {
                                if (!/[a-zA-Z]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
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

                        <div style={{ marginTop: '1.5rem', display: 'flex', alignSelf: 'center' }}>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </CandidateFormPopup>
            }

            {/* Popup form for edit button */}
            {popupButtonEdit &&
                <CandidateFormPopup setTrigger={setPopupButtonEdit}>
                    {voters.map((voter) => {
                        if (voter._id === selectedVoter) {
                            return (
                                <form
                                    key={voter._id}
                                    style={{ display: 'flex', flexDirection: 'column' }}
                                    onSubmit={(e) => {
                                        handleEdit(e)
                                        setPopupButtonEdit(false)
                                    }}>
                                    <h1 style={{ marginBottom: '0.5rem' }}>Edit Voter</h1>
                                    <label>First Name: </label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder={voter.firstname}
                                        onChange={(e) => handleChange(e)}
                                        maxLength={20}
                                        onKeyPress={(event) => {
                                            if (!/[a-zA-Z]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                    <br />

                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder={voter.lastname}
                                        onChange={(e) => handleChange(e)}
                                        maxLength={20}
                                        onKeyPress={(event) => {
                                            if (!/[a-zA-Z]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                    <br />

                                    <label>Date of Birth:</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        placeholder={voter.dob}
                                        onChange={(e) => handleChange(e)}
                                    />

                                    <div style={{ marginTop: '1.5rem', display: 'flex', alignSelf: 'center' }}>
                                        <button type="submit">Submit</button>
                                    </div>
                                </form>
                            )
                        } 
                    })}
                </CandidateFormPopup>
            }
        </div>
    );
};

export default VoterView;
