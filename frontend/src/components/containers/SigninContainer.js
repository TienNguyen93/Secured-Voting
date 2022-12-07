import { SigninView } from "../views";
import React from "react";

const SigninContainer = (props) => {
    const { handler } = props;

    return <SigninView handler={handler}/>;
};

export default SigninContainer;
