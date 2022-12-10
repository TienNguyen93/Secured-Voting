import { SignupView } from "../views";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupContainer = () => {
    const navigate = useNavigate();
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

        registerVoter.dob =
            registerVoter.dob.substring(5, 7) +
            "/" +
            registerVoter.dob.substring(8) +
            "/" +
            registerVoter.dob.substring(0, 4);

        if (registerVoter.password !== registerVoter.confirmPassword) {
            alert("Passwords do not match.");
        } else {
            voters.every((voter, index) => {
                // if ssn match, retrieve voter's ID
                //TODO: check if other information is correct
                if (
                    Number(registerVoter.ssn) === voter.ssn &&
                    registerVoter.firstname === voter.firstname &&
                    registerVoter.lastname === voter.lastname &&
                    registerVoter.dob === voter.dob &&
                    voter.registered === false
                ) {
                    const id = voter._id;
                    if (voter.registered === true) {
                        console.log("User already registered");
                    } else {
                        const request = {
                            method: "PUT",
                            headers: { "content-Type": "application/json" },
                            body: JSON.stringify({
                                firstname: voter.firstname,
                                lastname: voter.lastname,
                                dob: voter.dob,
                                ssn: voter.ssn,
                                password: registerVoter.password,
                                email: registerVoter.email,
                                registered: true,
                                voted: false,
                            }),
                        };
                        fetch(`http://localhost:5000/voters/${id}`, request)
                            .then((response) => response.json())
                            .then((data) => console.log("put method", data))
                            .catch((error) => console.log(error));

                        alert("You have successfully registered.");
                        navigate("/");
                        return false;
                    }
                } else if (index === Object.keys(voters).length - 1) {
                    alert("Information does not match. Please try again.");
                }

                return true;
            });
        }
    };

    return (
        <SignupView handleChange={handleChange} handleSubmit={handleSubmit} />
    );
};

export default SignupContainer;
