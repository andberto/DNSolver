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
    const [checked, setChecked] = useState({
        'A': false,
        'AAAA': false,
        'SOA': false,
        'IP': false,
        'CAA': false,
        'SERVICE': false,
        'LOOKUP': false,
        'CNAME': false,
        'MX': false,
        'NS': false,
        'SRV': false,
        'PTR': false,
        'TXT': false,
        'ANY': false
    });
    const [searchString, setSearchString] = useState("");

    const handleOnSearch = (string, results) => {
        setSearchString(string);
    };

    const handleOnHover = (result) => {
      console.log(result);
    };

    const handleOnSelect = (item) => {
        setSearchString(item.request);
        for (const [key, value] of Object.entries(checked)) {
            checked[key] = false;
        }
        checked[item.type] = true;
    };

    const handleOnFocus = () => {
      console.log("Focused");
    };

    const handleOnClear = () => {
      console.log("Cleared");
    };

    function handleCheckOnClick(id) {
        var tmp = {};
        Object.assign(tmp, checked);
        if(tmp[id]) {
            tmp[id] = false;
        }
        else if(!tmp[id]) {
            tmp[id] = true;
        }
        setChecked(tmp);
    }

    function handleQuery() {
        // mettere dizionario per risultati
        for (const [key, value] of Object.entries(checked)) {
            var query = Constants.BACKEND_URL + auth.username;
            if(checked[key]) {
                if(key === "MX") {query += (Constants.MX + searchString);}
                else if(key === "A") {query += (Constants.A + searchString);}
                else if(key === "AAAA") {query += (Constants.AAAA + searchString);}
                else if(key === "SOA") {query += (Constants.SOA + searchString);}
                else if(key === "IP") {query += (Constants.IP + searchString);}
                else if(key === "CAA") {query += (Constants.CAA + searchString);}
                else if(key === "SERVICE") {query += (Constants.SERVICE + searchString);}
                else if(key === "CNAME") {query += (Constants.CNAME + searchString);}
                else if(key === "MX") {query += (Constants.MX + searchString);}
                else if(key === "NS") {query += (Constants.NS + searchString);}
                else if(key === "SRV") {query += (Constants.SRV + searchString);}
                else if(key === "PTR") {query += (Constants.PTR + searchString);}
                else if(key === "TXT") {query += (Constants.TXT + searchString);}
                console.log(query);
                //console.log(query + Constants.MX + searchString);
                axios.get(query).then(function (res) {
                    console.log(res.data);
                });
            }
        }

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
                    <FancyCheckbox label = 'MX' isChecked={checked['MX']} onChange = {() => handleCheckOnClick('MX')} />
                    <FancyCheckbox label = 'AAAA'  isChecked={checked['AAAA']} onChange = {() => handleCheckOnClick('AAAA')}/>
                    <FancyCheckbox label = 'IP'  isChecked={checked['IP']} onChange = {() => handleCheckOnClick('IP')}/>
                    <FancyCheckbox label = 'SOA'  isChecked={checked['SOA']} onChange = {() => handleCheckOnClick('SOA')}/>
                    <FancyCheckbox label = 'CAA'  isChecked={checked['CAA']} onChange = {() => handleCheckOnClick('CAA')}/>
                    <FancyCheckbox label = 'LOOKUP' isChecked={checked['LOOKUP']}  onChange = {() => handleCheckOnClick('LOOKUP')}/>
                    <FancyCheckbox label = 'CNAME' isChecked={checked['CNAME']} onChange = {() => handleCheckOnClick('CNAME')}/>
                    <FancyCheckbox label = 'A'  isChecked={checked['A']} onChange = {() => handleCheckOnClick('A')}/>
                    <FancyCheckbox label = 'NS' isChecked={checked['NS']}  onChange = {() => handleCheckOnClick('NS')}/>
                    <FancyCheckbox label = 'SRV'  isChecked={checked['SRV']} onChange = {() => handleCheckOnClick('SRV')}/>
                    <FancyCheckbox label = 'PTR' isChecked={checked['PTR']}  onChange = {() => handleCheckOnClick('PTR')}/>
                    <FancyCheckbox label = 'TXT'  isChecked={checked['TXT']} onChange = {() => handleCheckOnClick('TXT')}/>
                    <FancyCheckbox label = 'ANY'  isChecked={checked['ANY']} onChange = {() => handleCheckOnClick('ANY')}/>
                </Stack>
                <Stack direction='row'>
                    <div style={{width: '75vw'}}>
                      <ReactSearchAutocomplete
                        onSelect = {handleOnSelect}
                        items={items}
                        onSearch={handleOnSearch}
                        onClear={handleOnClear}
                        showClear={false}
                        inputSearchString={searchString}
                        inputDebounce={500}
                        autoFocus
                        styling={{hoverBackgroundColor: "#eee"}}
                        formatResult={formatResult}
                        fuseOptions={{keys: ['request']}}
                      />
                    </div>
                    <FancyButton onClick={handleQuery}/>
                </Stack>
            </div>
        </>
    );
  }

export default Dashboard;
