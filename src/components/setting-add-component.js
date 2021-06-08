import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import axios from 'axios';
import { SYSTEM_SETTINGS_URL, safeHeaders } from './api-config.js';

const Styles = styled.div`
.container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 80%;
    margin: auto;
   
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }
  
  

.col-25 {
  float: left;
  width: 25%;
  margin-top: 6px;
}


.col-75 {
  float: left;
  width: 75%;
  margin-top: 6px;
}


input[type=text], select, textarea{
    width: 90%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;
}

label {
    padding: 0;
    display: inline-block;
  }


.btn-red {
  background-color: #4527a0; 
  border: none; 
  color: white; 
  padding: 10px 16px; 
  font-size: 16px; 
  cursor: pointer; 
  border-radius: 5px;
  width: 150px;
  margin-left: 5px;

}


.btn-red:hover {
  background-color: #5e35b1;
}

.submit-wrap {
  text-align: center;
  width: 100%;
  margin: 12px auto;
}

.btn-small {
  background-color: #3f51b5; 
  border: none; 
  color: white; 
  padding: 5px 10px; 
  font-size: 14px; 
  cursor: pointer; 
  border-radius: 3px;
  margin-left: 5px;

}


.btn-small:hover {
  background-color: #757de8;
}



`





const SettingAddComponent = () => {
    
    const [sysKey, setSysKey] = useState('');
    const [value, setValue] = useState('');
    const [updateMessage, setUpdateMessage] = useState(null);
 
    const sendPostRequest = async (newData) => {

        try {
          const resp = await axios.post(SYSTEM_SETTINGS_URL, newData, safeHeaders);
          console.log(resp.data);
          setUpdateMessage('Data sucessfully written to the database!');
    
    
        } catch (err) {
    
          console.error(err);
          setUpdateMessage('Error encountered while writing to the database!');
        }
    
      }


    const handleSubmit = (event) => {
        event.preventDefault();
        
        const sendData = {
            syskey: sysKey,
            value: value,
        }

        sendPostRequest(sendData);
    
      };	

      

    return (
    <Styles>
        <div className="container">
        <form >

        <div className="row">
                <div className="col-25">
                    <label>System Key</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "syskey"
                    value={sysKey} 
                    onChange={(event)=>setSysKey(event.target.value)}
                    />
                </div>

            </div>
           
            <div className="row">
                <div className="col-25">
                    <label>Value</label>
                </div>
                <div className="col-75">
                    <input 
                    type="text" 
                    id = "value"
                    value={value} 
                    onChange={(event)=>setValue(event.target.value)}
                    />
                </div>
            </div>

            <div className="submit-wrap">
              <button 
                className="btn-red" 
                type="submit"
                onClick={handleSubmit}
              >Submit</button></div>
            
            </form>
            <div>{updateMessage}</div>
            </div>
        </Styles>
      
    );
  };

  export default SettingAddComponent;