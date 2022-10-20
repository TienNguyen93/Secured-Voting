// import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from "react-router-dom";

// const useStyles = makeStyles( () => ({

// }));

const SignupView = () => {
    // const classes = useStyles();
    return (
        <div>
            <h1>Sign Up</h1>
            <form>
                <label>First Name: </label>
                <input type="text" name="firstName" />
                <br />

                <label>Last Name: </label>
                <input type="text" name="lastName" />
                <br />
                
                <label>Email: </label>
                <input type="email" name="email" />
                <br />

                <label>Date of Birth: </label>
                <input type="date" name="dateOfBirth" />
                <br />

                <label>Social Security Number: </label>
                <input type="text" name="ssn" />
                <br />

                <label>Password: </label>
                <input type="password" name="password" />
                <br />

                <label>Confirm Password: </label>
                <input type="password" name="confirmPassword" />
                <br />

                <input type="submit" value="Submit" />
            </form>

            <p>Already have an account? </p>
            <Link to={'/signin'}>Sign in</Link>
        </div>
    )
}

export default SignupView;