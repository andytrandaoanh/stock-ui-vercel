import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import axios from 'axios';
import { STOCK_PLUNGE_URL, safeHeaders } from './api-config.js';

const Styles = styled.div`
.container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 50%;
    margin: auto;
   
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }
  
  

.col-25 {
  float: left;
  width: 35%;
  margin-top: 6px;
}


.col-75 {
  float: left;
  width: 65%;
  margin-top: 6px;
}


input[type=text], select, textarea{
    width: 60%;
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
  background-color: #3f51b5; 
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
  background-color: #757de8;
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
  width: 80px;
  margin-left: 5px;

}


.btn-small:hover {
  background-color: #757de8;
}


`


export default function PlungeAddComponent()  {
    const [startDate, setStartDate] = useState(new Date());    
    const [duration, setDuration] = useState(0);
    const [loss, setLoss] = useState(0.0);
    const [last, setLast] = useState(0.0);
    const [updateMessage, setUpdateMessage] = useState(null);

    const getCombinedDate = () =>{
      const datePart = startDate.getDate().toString().padStart(2, '0');
      //console.log('date part', datePart);
      const monthPart = (startDate.getMonth() +1).toString().padStart(2, '0');
      //console.log('month part', monthPart);
      const yearPart = startDate.getFullYear().toString();
      const dateseq = parseInt(yearPart + monthPart + datePart);

      return dateseq;

    }
    

    const sendPostRequest = async (newData) => {

    
        //ready to send to API using Axios
        //console.log(newTerm);
        try {
          const resp = await axios.post(STOCK_PLUNGE_URL, newData, safeHeaders);
          console.log(resp.data);
          setUpdateMessage('Data sucessfully written to the database!');
          //history.push(`/home`);
    
        } catch (err) {
          // Handle Error Here
          console.error(err);
          setUpdateMessage('Error encountered while writing to the database!');
        }
    
      }


    const handleSubmit = (event) => {
        event.preventDefault();
        
        const sendData = {            
            dateseq: getCombinedDate(),
            duration: duration,
            loss: loss,
            last: last

        }
        //console.log(sendData);	  	  
        sendPostRequest(sendData);
    
      };	

      

    return (
    <Styles>
        <div className="container">
        <form >

            
            <div class="row">
            <div class="col-25">      
            <label>Transaction Date</label> 
            </div>
            <div class="col-75">
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label>Loss Index</label>
                </div>
                <div class="col-75">
                <input 
                    type="text" 
                    id = "loss"
                    value={loss} 
                    onChange={(event)=>setLoss(event.target.value)}
                    />
                </div>
            </div>


            <div class="row">
                <div class="col-25">
                    <label>Duration</label>
                </div>
                <div class="col-75">
                    <input 
                    type="text" 
                    id = "duration"
                    value={duration} 
                    onChange={(event)=>setDuration(event.target.value)}
                    />
                </div>
            </div>

            <div class="row">
                <div class="col-25">
                    <label>Last Index</label>
                </div>
                <div class="col-75">
                <input 
                    type="text" 
                    id = "last"
                    value={last} 
                    onChange={(event)=>setLast(event.target.value)}
                    />
                </div>
            </div>
            <div className="submit-wrap">
              <button 
                className="btn-red" 
                type="submit"
                onClick = {handleSubmit}
                >Submit</button></div>
            
            </form>
            <div>{updateMessage}</div>
            </div>
        </Styles>
      
    );
  };

  