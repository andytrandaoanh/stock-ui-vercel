import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import axios from 'axios';
import { INDEX_TRANSACTIONS_URL, WEB_SCRAPERS_URL, safeHeaders } from './api-config.js';

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
    width: 100px;
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





const AddStockData = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [ticker, setTicker] = useState('');
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [high, setHigh] = useState(0);
    const [low, setLow] = useState(0);
    const [volume, setVolume] = useState(0);
    const [updateMessage, setUpdateMessage] = useState(null);
 
    const stripComma = (input) => {
      return (input.replaceAll(',', ''))

    }

    const sendGetRequest2 = async (symbol) => {

    
      let date = getCombinedDate();
      try {
        const resp = await axios.get(`${WEB_SCRAPERS_URL}?site=cophieu68&date=${date}&ticker=${symbol}`, safeHeaders);
        //console.log(resp.data);
        setHigh(stripComma(resp.data.high));
        setLow(stripComma(resp.data.low));
        setOpen(stripComma(resp.data.open));
        setClose(stripComma(resp.data.close));
        setVolume(stripComma(resp.data.volume));
        
        
        

        setUpdateMessage(`Data sucessfully scraped for ticker
         ${resp.data.ticker} for  ${resp.data.date}`);
        //history.push(`/home`);
  
      } catch (err) {
        // Handle Error Here
        console.error(err);
        setUpdateMessage('Error encountered while scraping web site!');
      }
  
    }


      
    
    
    const handleScrape = (symbol) =>{

      switch(symbol) {
        case '^VNINDEX':
          setTicker('VNINDEX');
          break;
        case '^HASTC':
          setTicker('HNX-INDEX');
          break;
        case '^UPCOM':
            setTicker('UPCOM-INDEX');
            break;
        case '^VN30':
            setTicker('VN30INDEX');
            break;
      } 
  
      sendGetRequest2(symbol);

    }
    
    
    const getCombinedDate = () =>{
      const datePart = startDate.getDate().toString().padStart(2, '0');
      //console.log('date part', datePart);
      const monthPart = (startDate.getMonth() +1).toString().padStart(2, '0');
      //console.log('month part', monthPart);
      const yearPart = startDate.getFullYear().toString();
      const dateseq = parseInt(yearPart + monthPart + datePart);

      return dateseq;

    }


    const sendGetRequest = async () => {

    
      //ready to send to API using Axios
      //console.log(newTerm);
      let date = getCombinedDate();
      try {

        const url = `${WEB_SCRAPERS_URL}?site=cafef&date=${date}&ticker=${ticker}`;
        //console.log(url);
        const resp = await axios.get(url, safeHeaders);
        //console.log(resp.data);
        setHigh(resp.data.high);
        setLow(resp.data.low);
        setOpen(resp.data.open);
        setClose(resp.data.close);
        setVolume(resp.data.volume);
        
        
        

        setUpdateMessage(`Data sucessfully scraped for ticker
         ${resp.data.ticker} for  ${resp.data.date}`);
        //history.push(`/home`);
  
      } catch (err) {
        // Handle Error Here
        console.error(err);
        setUpdateMessage('Error encountered while scraping web site!');
      }
  
    }




    const handleClick = () => {
      //console.log('click');
      if (ticker) sendGetRequest();
    }

    const sendPostRequest = async (newData) => {

    
        //ready to send to API using Axios
        //console.log(newTerm);
        try {
          const resp = await axios.post(INDEX_TRANSACTIONS_URL, newData, safeHeaders);
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
        //console.log('date', startDate);
        const datePart = startDate.getDate().toString().padStart(2, '0');
        //console.log('date part', datePart);
        const monthPart = (startDate.getMonth() +1).toString().padStart(2, '0');
        //console.log('month part', monthPart);
        const yearPart = startDate.getFullYear().toString();
        const dateseq = parseInt(yearPart + monthPart + datePart);
        
        const sendData = {
            ticker: ticker.toUpperCase(),
            dateseq: dateseq,
            open: open,
            close: close,
            high: high,
            low: low,
            volume: volume
        }
        //console.log(sendData);	  	  
        sendPostRequest(sendData);
    
      };	

      

    return (
    <Styles>
        <div className="container">
        <form >

        <div className="row">
                <div className="col-25">
                    <label>Ticker</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "high"
                    value={ticker} 
                    onChange={(event)=>setTicker(event.target.value)}
                    />

                <button   type="button" className="btn-small"
                  onClick={(event) => handleScrape('^VNINDEX')} >VNX
                </button>
                <button   type="button" className="btn-small"
                  onClick={(event) => handleScrape('^HASTC')} >HNX
                </button>
                <button   type="button" className="btn-small"
                  onClick={(event) => handleScrape('^UPCOM')} >UPCOM
                </button>
                <button   type="button" className="btn-small"
                  onClick={(event) => handleScrape('^VN30')} >VN30
                </button>               
                </div>
            </div>
           
            <div className="row">
            <div className="col-25">      
            <label>Transaction Date</label> 
            </div>
            <div className="col-75">
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
              <button 
                type="button" 
                className="btn-small"
                onClick={(event) => handleClick}
              >Get Data</button>
            </div>
            </div>
            <div className="row">
                <div className="col-25">
                    <label>Open</label>
                </div>
                <div className="col-75">
                    <input 
                    type="text" 
                    id = "open"
                    value={open} 
                    onChange={(event)=>setOpen(event.target.value)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-25">
                    <label>High</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "high"
                    value={high} 
                    onChange={(event)=>setHigh(event.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-25">
                    <label>Low</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "low"
                    value={low} 
                    onChange={(event)=>setLow(event.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-25">
                    <label>Close</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "close"
                    value={close} 
                    onChange={(event)=>setClose(event.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-25">
                    <label>Volume</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "close"
                    value={volume} 
                    onChange={(event)=>setVolume(event.target.value)}
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

  export default AddStockData;