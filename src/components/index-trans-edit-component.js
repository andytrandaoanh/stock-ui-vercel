import React, { Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import axios from 'axios';
import { INDEX_TRANSACTIONS_URL, WEB_SCRAPERS_URL,safeHeaders } from './api-config.js';

const Styles = styled.div`

.data-list-container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 10px;
  width: 45%;
  height: 250px;
  margin: 0px 10px;
  float: left;
  

}

.form-container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 10px;
    width: 40%;
    height: 250px;
    margin: 0px 10px;
    float: left;
   
 }

 .form-row:after {
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

.btn-blue {
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


.btn-blue:hover {
  background-color: #5e35b1;
}



.btn-red {
  background-color: red; 
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
  background-color: darkgray; 
  border: none; 
  color: white; 
  padding: 5px 10px; 
  font-size: 10px; 
  cursor: pointer; 
  border-radius: 3px;
  margin-left: 5px;

}


.btn-small:hover {
  background-color: #5c6bc0;
}

table {
  font-size: 12px;
}


`


const IndexTranEdit = () => {
    
    const flagEdit = 1;
    const flagDelete = 2;
    const [startDate, setStartDate] = useState(new Date());
    const [ticker, setTicker] = useState('');
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [high, setHigh] = useState(0);
    const [low, setLow] = useState(0);
    const [volume, setVolume] = useState(0);
    const [itemId, setItemId] = useState(0);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [listData, setListData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);    
    const [flag, setFlag] = useState(flagEdit);
    const [submitButtonText, setSubmitButtonText] = useState('Save Change');
    const [submitButtonClass, setSubmitButtonClass] = useState('btn-blue');

    useEffect(() => {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
  
          try {
          const result = await axios.get(`${INDEX_TRANSACTIONS_URL}?limit=8`, safeHeaders);
          //console.log(result.data);
          setListData(result.data);
        } catch (error) {
          setIsError(true);
          console.log('error:', error);
        }
  
        setIsLoading(false);
        //console.log(listData);
   
      };
   
      fetchData();
    }, []);  

    
    const converDateSequence = (dateseq) => {
      const dateString = dateseq.toString();
      const yString = dateString.substring(0,4);
      const mString = dateString.substring(4,6);
      const dString = dateString.substring(6,8);

      return dString + '/' + mString + '/' + yString ;

    }

    const converDateSequence2 = (dateseq) => {
      const dateString = dateseq.toString();
      const yString = dateString.substring(0,4);
      const mString = dateString.substring(4,6);
      const dString = dateString.substring(6,8);
      const newDate = new Date(yString + '-'  + mString +  '-' + dString);
      //console.log(new DatenewDate);
      return (newDate) ;

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

    const handleItemClick = (event, id, flag) => {
      event.preventDefault();
      listData.forEach(item =>{
        if (item.id === id) {
          setTicker(item.ticker);
          setStartDate(converDateSequence2(item.dateseq));
          setItemId(id);
          setFlag(flag);
          setHigh(item.high_px);
          setLow(item.low_px);
          setOpen(item.open_px);
          setClose(item.close_px);
          setVolume(item.volume);
        }

        if (flag === flagEdit) {
          setSubmitButtonText("Save Change");
          setSubmitButtonClass("btn-blue");
        }
        else if (flag === flagDelete) {
          setSubmitButtonText("Delete Data");
          setSubmitButtonClass("btn-red");

        }
        
      })
      
    }




    const handleClick = () => {
      //console.log('click');
      if (ticker) sendGetRequest();
    }


    const sendDeleteRequest = async () => {

    
      //ready to send to API using Axios
      //console.log(newTerm);
      try {
        const resp = await axios.delete(`${INDEX_TRANSACTIONS_URL}/${itemId}`, safeHeaders);
        //console.log(resp.data);
        setUpdateMessage('Data sucessfully removed From the database!');
        //history.push(`/home`);
  
      } catch (err) {
        // Handle Error Here
        console.error(err);
        setUpdateMessage('Error encountered while writing to the database!');
      }
  
    }



    const sendPutRequest = async (newData) => {

    
        //ready to send to API using Axios
        //console.log(newTerm);
        try {
          const resp = await axios.put(`${INDEX_TRANSACTIONS_URL}/${itemId}`, newData, safeHeaders);
          //console.log(resp.data);
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
        if (flag === flagEdit) sendPutRequest(sendData);
        else if (flag === flagDelete) sendDeleteRequest();
    
      };	

    
    const createForm = ()  =>{
      return (

        
        <form >

        <div className="form-row">
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
                </div>
            </div>
           
            <div className="form-row">
            <div className="col-25">      
            <label>Transaction Date</label> 
            </div>
            <div className="col-75">
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
              <button 
                type="button" 
                className="btn-small"
                onClick={handleClick}
              >Get Data</button>
            </div>
            </div>
            <div className="form-row">
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
            <div className="form-row">
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

            <div className="form-row">
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

            <div className="form-row">
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

            <div className="form-row">
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
                className={submitButtonClass}
                type="submit"
                onClick={handleSubmit}
                >{submitButtonText}
              </button></div>
              <div>{updateMessage}</div>
            </form>
            
            

      )

    }


    return (
    <Styles>
      <div className="data-list-container">
       <Fragment>

       {isError && <div>Something went wrong when loading API data ...</div>}
       {isLoading && <div>Loading ...</div> }
       <table>
         <tr>
             <th>Ticker</th>
             <th>Date</th>
             <th>Open</th>
             <th>Volume</th>
             <th>Close</th>
             <th>Edit</th>
             <th>Delete</th>

        </tr>
        {listData && listData.map(item =>{
            return (
              <tr key={item.id}>
              <td>{item.ticker}</td>
              <td>{converDateSequence(item.dateseq)}</td>
              <td>{item.open_px}</td>
              <td>{item.volume}</td>
              <td>{item.close_px}</td>
              <td><button className="btn-small"  onClick={(event)=>{handleItemClick(event, item.id, flagEdit)}}>Edit</button></td>
              <td><button className="btn-small"  onClick={(event)=>{handleItemClick(event, item.id, flagDelete)}}>Delete</button></td>
              </tr>


            )
        })}

        </table>
      

       </Fragment>
      </div>
      <div className="form-container">
        {createForm()}
      </div>


    </Styles>
      
    );
  };

  export default IndexTranEdit;