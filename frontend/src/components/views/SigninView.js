import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./SigninView.css"

const SigninView = (props) => {
    const { handler } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");
    const [user, setUser] = useState();
    const [error, setError] = useState("")

    const onSubmitForm = (event) => {
        event.preventDefault();

        window.localStorage.clear();
        if (email === "" || password === "") {
            alert("Please fill in all fields");
            window.location.reload();
        }

        const configuration = {
            method: "post",
            url: "http://localhost:5000/login",
            data: {
                email,
                password,
            },
        };

        axios(configuration)
            .then((result) => {
                console.log("hellooooooo", result.data, typeof result.data);
                setUser(result.data);
                const keys = Object.keys(result.data);
                const values = Object.values(result.data);
                setResponse(keys[0]);
                localStorage.setItem("item", JSON.stringify(values[0]));
                handler(values[0]);
            })
            .catch((error) => {
                console.log(error);
                setError(error.code)
            });
    };

    const Redirect = ({ res, error }) => {
        if (res === "Voter" || res === "Admin") {
            window.localStorage.setItem("isLoggedIn", "true");
        }
        if (res === "Voter") {
            if (Object.values(user)[0].voted) {
                return <Navigate to="/vote-success" />;
            } else {
                return <Navigate to="/voting" />;
            }
        }
        if (res === "Admin") {
            return <Navigate to="/admin" />;
        }
        if (res === "None" || error === "ERR_BAD_RESPONSE") {
            return (
                <div className="error">
                    <div className="error-title">Wrong credentials</div>
                    <div className="error-content">
                        Invalid email or password{" "}
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            <h1 style={{textAlign: 'center', marginTop: '3rem', marginBottom: '2rem'}}>
                Welcome to Secured Voting!
            </h1>
            <div className="login-wrapper">
                <h1>Login</h1>
                <form className="login-form" onSubmit={onSubmitForm}>
                    <div className="input-container">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required="required"
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required="required"
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" onClick={onSubmitForm}>
                            Login
                        </button>
                    </div>
                </form>

                <Redirect res={response} error={error}/>

                <div className="parent">
                    <div className="child-one">
                        <p>New to Secured Voting?</p>
                    </div>
                    <div className="child-two">
                        <Link className="link" to={"/signup"}>
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SigninView;
