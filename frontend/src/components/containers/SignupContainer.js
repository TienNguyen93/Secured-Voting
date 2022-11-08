import { SignupView } from "../views";
import React, { Component, useState } from "react";

class SignupContainer extends Component {
    // Initialize state
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            date_of_birth: "",
            ssn: "",
            password: "",
            confirm_password: "",
        };
    }

    // Capture input data when it is entered
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault(); // Prevent browser reload/refresh after submit.

        // store data from backend
        const [voter, setVoter] = useState([]);

        // fetch data from backend
        // not working yet
        fetch("/Voters").then((response) =>
            response.json().then((data) => {
                console.log(data); // testing data - remove after testing
                setVoter(data);
            })
        );

        const {
            first_name,
            last_name,
            email,
            date_of_birth,
            ssn,
            password,
            confirm_password,
        } = this.state;

        // update data from backend
        voter.map((voter) => {
            if (voter.ssn === ssn && voter.voted === false) {
                fetch("/Voters", {
                    method: "PUT",
                    headers: {
                        "content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        first_name,
                        last_name,
                        email,
                        date_of_birth,
                        ssn,
                        password,
                        registered: true,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                    });
            }
        });
    };

    render() {
        return (
            <SignupView
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
            />
        );
    }
}

export default SignupContainer;