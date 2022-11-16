import { SignupView } from "../views";
import React, { useState, useEffect } from "react";

const SignupContainer = () => {
    const [voters, setVoters] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/voters").then((response) =>
            response.json().then((data) => {
                setVoters(data);
            })
        );
    }, []);

    // Initialize state
    const [registerVoter, setRegisterVoter] = useState({});

    // Capture input data when it is entered
    const handleChange = (e) => {
        let newVoter = {};
        newVoter = { [e.target.name]: e.target.value };
        setRegisterVoter((registerVoter) => ({
            ...registerVoter,
            ...newVoter,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent browser reload/refresh after submit.
        if (registerVoter.password !== registerVoter.confirmPassword) {
            alert("Passwords do not match.");
        } else {
            voters.map(voter => {
                // if ssn match, retrieve voter's ID
                if (Number(registerVoter.ssn) === voter.ssn) {
                    const id = voter._id
                    if (voter.registered === true) {
                        console.log('User already registered')
                    } else {
                        const request = {
                            method: "PUT",
                            headers: { "content-Type": "application/json" },
                            body: JSON.stringify({
                                password: registerVoter.password,
                                email: registerVoter.email,
                                registered: true,
                            }),
                        }
                        fetch(`http://localhost:5000/voters/${id}`, request)
                            .then((response) => response.json())
                            .then((data) => console.log('put method', data))
                            .catch(error => console.log(error))
                    }
                }
            })
        }
    };

    return (
        <SignupView handleChange={handleChange} handleSubmit={handleSubmit} />
    );
};

export default SignupContainer;