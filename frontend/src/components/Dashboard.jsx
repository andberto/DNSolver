import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";
import AuthContext from "../contexts/AuthContext.jsx";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import FancyBar from "./FancyBar";
import * as Constants from '../Constants';
import lgImg from '../images/logo.png';

const handleOnSearch = (string, results, auth) => {
  console.log(string, results);
};

const handleOnHover = (result) => {
  console.log(result);
};

const handleOnSelect = (item) => {
  console.log(item);
};

const handleOnFocus = () => {
  console.log("Focused");
};

const handleOnClear = () => {
  console.log("Cleared");
};

const formatResult = (item) => {
  console.log(item);
  return (
    <div className="result-wrapper">
        <span className="result-span" style= {{
            backgroundColor: 'rgb(255, 0, 0,0.5)',
            marginRight: '20px',
        }}>{item.type}</span>
        <span className="result-span" style= {{backgroundColor: 'rgb(107, 218, 255,0.5)'}}>{item.request}</span>
    </div>
  );
};

const Dashboard = () => {
    const { auth } = useContext(AuthContext);
    const [items, setItems] = useState("");

    useEffect(() => {
        document.title = "W.V.C - Dashboard";
        axios.get(Constants.BACKEND_URL + auth.username + '/history/').then(function (res) {
            setItems(res.data.history);
        });
    }, [auth])

    return (
        <>
            <FancyBar/>
            <div style={{position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, -50%)'}}>
            <img style={{ width: '30%'}} src={lgImg} />
                <div style={{width: '50vw'}}>
                  <ReactSearchAutocomplete
                    items={items}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    onFocus={handleOnFocus}
                    onClear={handleOnClear}
                    styling={{hoverBackgroundColor: "#eee"}}
                    formatResult={formatResult}
                    autoFocus
                    fuseOptions={{keys: ['request' , 'type']}}
                  />
                  </div>
            </div>
        </>
    );
  }

export default Dashboard;
