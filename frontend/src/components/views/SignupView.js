// import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import { Link } from "react-router-dom";

const SignupView = (props) => {
    const { handleChange, handleSubmit } = props;
    
    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label>First Name: </label>
                <input
                    type="text"
                    name="firstname"
                    required
                    onChange={(e) => handleChange(e)}
                />
                <br />

                <label>Last Name: </label>
                <input
                    type="text"
                    name="lastname"
                    required
                    onChange={(e) => handleChange(e)}
                />
                <br />

                <label>Email: </label>
                <input
                    type="email"
                    name="email"
                    required
                    onChange={(e) => handleChange(e)}
                />
                <br />

                <label>Date of Birth: </label>
                <input
                    type="date"
                    name="dob"
                    required
                    onChange={(e) => handleChange(e)}
                />
                <br />

                <label>Social Security Number: </label>
                <input
                    type="text"
                    name="ssn"
                    required
                    maxLength={10}
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }}
                    onChange={(e) => handleChange(e)}
                />
                <br />

                <label>Password: </label>
                <input
                    type="password"
                    name="password"
                    required
                    onChange={(e) => handleChange(e)}
                />
                <br />

                <label>Confirm Password: </label>
                <input
                    type="password"
                    name="confirmPassword"
                    required
                    onChange={(e) => handleChange(e)}
                />
                <br />
                
                <div>
                <div className='button-container'>
                    <button type="submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                </div>
                
            </form>

            <p>Already have an account? </p>
            <Link to={"/"}>Sign in</Link>
        </div>
    );
};

export default SignupView;
