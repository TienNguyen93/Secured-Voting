import React from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';

const SigninView = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const onUpdateField = event => {
        const nextFormState = {
            ...form,
            [event.target.name]: event.target.value,
        }
        console.log(event.target.value)
        setForm(nextFormState)
    }

    const onSubmitForm = event => {
        event.preventDefault()
        alert(JSON.stringify(form, null, 2))
    }

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={onSubmitForm}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onUpdateField}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onUpdateField}
                    />
                </div>
                <div>
                    <button type="submit">
                        Login
                    </button>
                </div>
            </form>

            <div>
                <p>New to Secured Voting?</p>
                <Link to={'/signup'}>Sign up</Link>
            </div>

        </div>
    )
}

export default SigninView;