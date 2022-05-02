import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";
import AuthContext from "../contexts/AuthContext.jsx";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import FancyBar from "./FancyBar";
import * as Constants from '../Constants';
import FancyCheckbox from './FancyCheckbox.jsx';
import FancyButton from './FancyButton.jsx';
import Stack from '@mui/material/Stack';

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
    const [items, setItems] = useState([]);
    const [searchString, setSearchString] = useState("");

    const handleOnSearch = (string, results) => {
        setSearchString(string);
    };

    const handleOnHover = (result) => {
      console.log(result);
    };

    const handleOnSelect = (item) => {
        //setSearchString(string);
    };

    const handleOnFocus = () => {
      console.log("Focused");
    };

    const handleOnClear = () => {
      console.log("Cleared");
    };

    function test(){
        alert('ciao');
    }

    useEffect(() => {
        document.title = "DNSolver - Dashboard";
        axios.get(Constants.BACKEND_URL + auth.username + '/history/').then(function (res) {
            setItems(res.data.history);
        });
    }, [auth])

    return (
        <>
            <FancyBar/>
            <div style={{position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, -50%)'}}>
                <Stack direction="row" style={{justifyContent: 'center'}}>
                    <FancyCheckbox label = 'MX' onChange = {test}/>
                    <FancyCheckbox label = 'AAAA' onChange = {test}/>
                    <FancyCheckbox label = 'IP' onChange = {test}/>
                    <FancyCheckbox label = 'SOA' onChange = {test}/>
                    <FancyCheckbox label = 'CAA' onChange = {test}/>
                    <FancyCheckbox label = 'LOOKUP' onChange = {test}/>
                    <FancyCheckbox label = 'CNAME' onChange = {test}/>
                    <FancyCheckbox label = 'A' onChange = {test}/>
                    <FancyCheckbox label = 'NS' onChange = {test}/>
                    <FancyCheckbox label = 'SRV' onChange = {test}/>
                    <FancyCheckbox label = 'PTR' onChange = {test}/>
                    <FancyCheckbox label = 'TXT' onChange = {test}/>
                    <FancyCheckbox label = 'ANY' onChange = {test}/>
                </Stack>
                <Stack direction='row'>
                    <div style={{width: '75vw'}}>
                      <ReactSearchAutocomplete
                        onSelect={handleOnSelect}
                        items={items}
                        onSearch={handleOnSearch}
                        onClear={handleOnClear}
                        inputSearchString={searchString}
                        inputDebounce={500}
                        autoFocus
                        styling={{hoverBackgroundColor: "#eee"}}
                        formatResult={formatResult}
                        fuseOptions={{keys: ['request']}}
                      />
                    </div>
                    <FancyButton/>
                </Stack>
            </div>
        </>
    );
  }

export default Dashboard;
