import React, { useContext } from 'react'
import AuthContext from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
            <h1>Login page</h1>
            <button onClick={() => { setAuth(true); navigate('/dashboard');}}> FAKE LOGIN </button>
        </>
    );
  }

export default Login;
