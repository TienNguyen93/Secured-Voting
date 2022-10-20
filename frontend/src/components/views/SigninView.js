import React from 'react';
import { Link } from "react-router-dom";

const SigninView = () => {
    return (
        <div>
            <h1>Sign In</h1>
            <form>
                <label>Email: </label>
                <input type="email" name="email" />
                <br />

                <label>Password: </label>
                <input type="password" name="password" />
                <br />

                <input type="submit" value="Submit" />
            </form>
            
            <p>New to Secured Voting?</p>
            <Link to={'/'}>Sign up</Link>
        </div>
    )
}

export default SigninView;