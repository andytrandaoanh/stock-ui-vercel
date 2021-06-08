import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { STOCK_DETAIL_URL,  safeHeaders } from './api-config';
import CircularProgress from '@material-ui/core/CircularProgress';



const Styles = styled.div`
.container {
  padding: 10px;
  margin: 5px auto;
  width: 100%;
}

.row-title {
  font-weight: bold;
  display: inline-block;
  width: 140px;
  text-align: left;
}

.btn-submit {
  background-color: #1769aa; 
  border: none; 
  color: white; 
  padding: 5px; 
  font-size: 12px; 
  cursor: pointer; 
  border-radius: 5px;
  width: 100px;
  margin-left: 5px;
  

}


.btn-submit:hover {
  background-color: #5e35b1;
}



.small-button {
  font-size: 10px;
  color: white; 
  margin: 2px;
  padding: 5px 8px;
  border-radius: 3px;
  background-color: #1769aa; 
  border: none;
}

.small-button:hover {  
  background-color: #5e35b1;
}


.text-note {
  width: 200px;
  height: 48px;
}


.form-control {
  display: inline-block;
  width: 220px;
  height: 60px;
  float: left;
}

.form-container {
  width: 90%;
  margin: 0px 20px;
}

.text-box {

  width: 40%;
  padding: 5px 10px;  
  border: none;
  border-bottom: 1px solid lightgray;

}

.text-box:focus {
  outline: none;
}


`
export default function StockDetailTab2Component(props) {
  const textEdit = "Save Change";
  const textAddNew = "Add Stock";
  
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ticker, setTicker] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [exchange, setExchange] = useState('');
  const [updateMessage, setUpdateMessage] = useState(null);
  const [buttonText, setButtonText] = useState(textAddNew);
  

  const prepareEditData = (event) =>{
    event.preventDefault();
    setTicker(data.ticker);      
    setCompany(data.company);
    setExchange(data.exchange);
    setIndustry(data.industry);
    setButtonText(textEdit);
  
  }

  const resetData = (event) =>{
    event.preventDefault();
    setTicker('');      
    setCompany('');
    setExchange('');
    setIndustry('');
    setButtonText(textAddNew);
  
  }

  const sendPutRequest = async (newData) => {
    
    //ready to send to API using Axios
    //console.log(newTerm);


    try {
      const resp = await axios.put(`${STOCK_DETAIL_URL}/${data.id}`, newData, safeHeaders);
      console.log(resp.data);

      setData(newData);

      setUpdateMessage('Data sucessfully written to the database!');
   

      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered while writing to the database!');
    }

  }





  
  const sendPostRequest = async (newData) => {
    
    //ready to send to API using Axios
    //console.log(newTerm);
    try {
      const resp = await axios.post(STOCK_DETAIL_URL, newData, safeHeaders);
      console.log(resp.data);
      setUpdateMessage('Data sucessfully written to the database!');

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered while writing to the database!');
    }

  }




  const handleClick = (event) =>{
    event.preventDefault();

    const newData = {
      ticker, company, industry, exchange
    }

    if (buttonText === textAddNew){
      sendPostRequest(newData);
    }

    else if (buttonText === textEdit){
      sendPutRequest(newData);
    }
 


  }

  useEffect(() => {
    


    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

        try {
        const result = await axios.get(`${STOCK_DETAIL_URL}/search?ticker=${props.ticker}`, safeHeaders);
        //console.log(result.data);
        setData(result.data[0]);


      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
     
 
    };

 
    fetchData();
  }, [props.ticker]);  




    return (

      <Styles>
      {isError && <div>Error encountered loading API data ...</div>}
      {isLoading && <div><CircularProgress /></div>}    
      {data &&
        
           <div className="container">
            <div>
                <button 
                  className="small-button"
                  onClick ={(event)=>prepareEditData(event)}
                >Edit Current Stock
                </button>
                <button 
                  className="small-button"
                  onClick ={(event)=>resetData(event)}
                >Add New Stock
                </button>
            </div>
            <p><span className="row-title">Ticker</span>
            <span className="row-data">
              
            <input className="text-box" 
              type="text" 
              id="ticker"
              value={ticker}
              onChange= {(event)=>{setTicker(event.target.value)}}
            >
            </input>       
            </span></p>
            <p><span className="row-title">Company</span>
            <span className="row-data">
            <input className="text-box" 
              type="text" 
              id="company"
              value={company}
              onChange= {(event)=>{setCompany(event.target.value)}}
            >
            </input></span></p>
            <p><span className="row-title">Exchange</span>
            <span className="row-data">
            <input className="text-box"  
              type="text" 
              id="exchange"
              value={exchange}
              onChange= {(event)=>{setExchange(event.target.value)}}
            ></input></span></p>
            <p><span className="row-title">Industry</span>
            <span className="row-data">
            <input className="text-box"  
              type="text" 
              id="industry"
              value={industry}
              onChange= {(event)=>{setIndustry(event.target.value)}}
            ></input></span></p>

            <button className="btn-submit" onClick={(event) => handleClick(event)}>{buttonText}
            </button>

          
          <div>{updateMessage}</div>

           
      </div> 

        
      }
    </Styles>       
      );



} 