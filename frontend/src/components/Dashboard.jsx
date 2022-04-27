import React, { useState } from 'react'
import axios from "axios";

const Dashboard = () => {
    const [result, setResult] = useState("");
    const testQuery = () => {
        axios
            .get("http://localhost:5000/resolve/a/www.unipr.it")
            .then((res) => {
                setResult(res.data[0] + " - " + res.data[1]);
            });
    };

    return (
        <>
            <h1>Dashboard page</h1>
            <button onClick={testQuery}>TEST A QUERY</button>
            <p>{result}</p>
        </>
    );
  }

export default Dashboard;
