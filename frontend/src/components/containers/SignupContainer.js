import { SignupView } from "../views";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupContainer = () => {
    const navigate = useNavigate();
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
            let voterFound = false;

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
                            email: registerVoter.email,
                            password: registerVoter.password,
                            registered: true,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                        });

                    voterFound = true;
                    alert("You have successfully registered.");
                    navigate("/");
                }
            });

            if (voterFound === false) {
                alert("SSN not found or already registered.");
            }
        }
    };

    return (
        <SignupView handleChange={handleChange} handleSubmit={handleSubmit} />
    );
};

export default SignupContainer;
