import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const SignupView = (props) => {
    const { handleChange, handleSubmit } = props;

    return (
        <div className="signup-wrapper">
            <h1>Create Account</h1>
            <form className="signup-form" onSubmit={(e) => handleSubmit(e)}>
                <div className="wrap">
                    <label className="signup-form-label">Name:</label>
                    <div className="signup-field">
                        <input
                            type="text"
                            name="firstname"
                            required
                            placeholder="First Name"
                            onChange={(e) => handleChange(e)}
                            maxLength={20}
                            onKeyPress={(event) => {
                                if (!/[a-zA-Z]/.test(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                        />
                    </div>
                    <div className="signup-field">
                        <input
                            type="text"
                            name="lastname"
                            required
                            placeholder="Last Name"
                            onChange={(e) => handleChange(e)}
                            maxLength={20}
                            onKeyPress={(event) => {
                                if (!/[a-zA-Z]/.test(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="wrap">
                    <label className="signup-form-label">Date of Birth:</label>
                    <div className="signup-field">
                        <input
                            type="date"
                            name="dob"
                            required
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>

                <div className="wrap">
                    <label className="signup-form-label">Social Security Number:</label>
                    <div className="signup-field">
                        <input
                            type="text"
                            name="ssn"
                            required
                            placeholder="Social Security Number"
                            maxLength={9}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>

                <div className="wrap">
                    <label className="signup-form-label">E-mail:</label>
                    <div className="signup-field">
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g jane123@gmail.com"
                            required
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>

                <div className="wrap">
                    <label className="signup-form-label">Password:</label>
                    <div className="signup-field">
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Password"
                            minLength={5}
                            maxLength={10}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>

                <div className="wrap">
                    <label className="signup-form-label">Confirm Password:</label>
                    <div className="signup-field">
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            placeholder="Confirm Password"
                            minLength={5}
                            maxLength={10}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>

                <div className="button-container">
                    <button type="submit">
                        Sign Up
                    </button>
                </div>
            </form>

            <div className="parent">
                <div className="child-one">
                    <p>Already have an account? </p>
                </div>
                <div className="child-two">
                    <Link className="link" to={"/"}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupView;
