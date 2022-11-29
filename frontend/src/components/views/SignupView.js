import React from "react";
import { Link } from "react-router-dom";

const SignupView = (props) => {
    const { handleChange, handleSubmit } = props;

    return (
        <div className="signup-wrapper">
            <h1>Create Account</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label className="signup-form-label">First Name</label>
                <br />
                <div className="signup-field">
                    <input
                        type="text"
                        name="firstname"
                        required
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <label className="signup-form-label">Last Name</label>
                <br />
                <div className="signup-field">
                    <input
                        type="text"
                        name="lastname"
                        required
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <label className="signup-form-label">Email</label>
                <br />
                <div className="signup-field">
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <label className="signup-form-label">Date of Birth</label>
                <br />
                <div className="signup-field">
                    <input
                        type="date"
                        name="dob"
                        required
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <label className="signup-form-label">
                    Social Security Number
                </label>
                <br />
                <div className="signup-field">
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
                </div>

                <label className="signup-form-label">Password</label>
                <br />
                <div className="signup-field">
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <label className="signup-form-label">Confirm Password</label>
                <br />
                <div className="signup-field">
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <div className="button-container">
                    <button type="submit">Sign Up</button>
                </div>
            </form>

            <p>Already have an account? </p>
            <Link className="link" to={"/"}>
                Sign in
            </Link>
        </div>
    );
};

export default SignupView;
