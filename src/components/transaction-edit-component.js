import React, { Fragment, useState, useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import axios from 'axios';
import { TRANSACTIONS_URL, safeHeaders } from './api-config.js';


const Styles = styled.div`

.data-list-container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 10px;
  width: 45%;
  height: 300px;
  margin: 0px 10px;
  float: left;
  

}

.form-container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 10px;
    width: 40%;
    height: 300px;
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

td, th {
  padding: 0px 5px;
}

`


export default function TransactionEditComponent()  {
    
    const flagEdit = 1;
    const flagDelete = 2;
    const [dateseq, setDateseq] = useState('');
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
    const [editCount, setEditCount] = useState(0);

    

   
    const handleItemClick = (event, id, flag) => {
      event.preventDefault();
      listData.forEach(item =>{
        if (item.id === id) {
          //setTicker(item.ticker);
          setDateseq(item.dateseq);
          setItemId(id);
          setFlag(flag);
          setTicker(item.ticker); 
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


    const sendDeleteRequest = async () => {

    
      //ready to send to API using Axios
      //console.log(newTerm);
      try {
        const resp = await axios.delete(`${TRANSACTIONS_URL}/${itemId}`, safeHeaders);
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
          const resp = await axios.put(`${TRANSACTIONS_URL}/${itemId}`, newData, safeHeaders);
          //console.log(resp.data);
          setUpdateMessage('Data sucessfully written to the database!');
          setEditCount(editCount + 1);
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
            ticker: ticker.toUpperCase(),
            dateseq: dateseq,
            open_px: open,
            close_px: close,
            high_px: high,
            low_px: low,
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
            <input 
                    type="text" 
                    id = "high"
                    value={dateseq} 
                    onChange={(event)=>setDateseq(event.target.value)}
                    />
              

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


    useEffect(() => {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
  
          try {
          const result = await axios.get(TRANSACTIONS_URL, safeHeaders);
          console.log(result.data);
          setListData(result.data);
          setIsLoading(false);

  
        } catch (error) {
          setIsError(true);
          console.log('error:', error);
        }
  
   
      };
   
      fetchData();
    }, [editCount]);  



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
             <th>High</th> 
             <th>Low</th> 
             <th>Close</th>
             <th>Volume</th>
             <th>Edit</th>
           

        </tr>
        {listData && listData.map(item =>{
            return (
              <tr key={item.id}>             
              <td>{item.ticker}</td>
              <td>{item.dateseq}</td>
              <td>{item.open_px}</td>              
              <td>{item.high_px}</td>
              <td>{item.low_px}</td>
              <td>{item.close_px}</td>
              <td>{item.volume}</td>
              <td><button className="btn-small"  onClick={(event)=>{handleItemClick(event, item.id, flagEdit)}}>Edit</button></td>
              
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


