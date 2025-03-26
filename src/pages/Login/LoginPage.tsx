import * as React from "react";
import {useEffect} from "react";

const LoginPage: React.FC = () => {

    useEffect( () => {
        console.log('atterrato in login page')
    }, [])
    return (
        <div>
            Login Page
        </div>
    )
}

export default LoginPage;