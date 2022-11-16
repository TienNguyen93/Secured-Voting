import { SignupView } from "../views";
import React, { useState, useEffect } from "react";

const SignupContainer = () => {
    const [voter, setVoter] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/voters").then((response) =>
            response.json().then((data) => {
                setVoter(data);
            })
        );
    }, []);

    // Initialize state
    const [registerVoter, setRegisterVoter] = useState({});

    // Capture input data when it is entered
    let handleChange = (e) => {
        let newVoter = {};
        newVoter = { [e.target.name]: e.target.value };
        setRegisterVoter((registerVoter) => ({
            ...registerVoter,
            ...newVoter,
        }));
    };

    let handleSubmit = (e) => {
        e.preventDefault(); // Prevent browser reload/refresh after submit.

        if (registerVoter.password !== registerVoter.confirmPassword) {
            alert("Passwords do not match.");
        } else {
            let found = false;
            // update data from backend
            voter.map((voter) => {
                if (
                    voter.ssn == registerVoter.ssn &&
                    voter.registered == false
                ) {
                    fetch("http://localhost:5000/voters", {
                        method: "PUT",
                        headers: {
                            "content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            password: registerVoter.password,
                            registered: true,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                        });
                    found = true;
                }
            });
            
            if (found == false) {
                alert("SSN not found or already registered.");
            }
        }
    };

    return (
        <SignupView handleChange={handleChange} handleSubmit={handleSubmit} />
    );
};

export default SignupContainer;
