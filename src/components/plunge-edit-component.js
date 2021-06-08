import React, { Fragment, useState, useEffect } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { STOCK_PLUNGE_URL, safeHeaders } from './api-config.js';






const Styles = styled.div`

.data-list-container {
  border-radius: 5px;
  background-color: white;
  padding: 10px;
  width: 35%;
  margin: 0px 10px;
  float: left;

}

.form-container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 10px;
    width: 55%;    
    margin: 0px 20px;
    float: left;
   
 }

 .form-row:after {
    content: "";
    display: table;
    clear: both;
 }
  
  

.col-25 {
  float: left;
  width: 20%;
  margin-top: 6px;
}


.col-75 {
  float: left;
  width: 80%;
  margin-top: 6px;
}


input[type=text], select, textarea{
    width: 80%;
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

.message-box {
  text-align: center;
  font-size: 0.8em;
  margin: 12px;
}

`


const SettingEditComponent = () => {
    
    const flagEdit = 1;
    const flagDelete = 2;
    const [dateseq, setDateseq] = useState(0);
    const [loss, setLoss] = useState(0.0);    
    const [last, setLast] = useState(0.0);    
    const [duration, setDuration] = useState(0);
    const [itemId, setItemId] = useState(0);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [listData, setListData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);    
    const [flag, setFlag] = useState(flagEdit);
    const [submitButtonText, setSubmitButtonText] = useState('Save Change');
    const [submitButtonClass, setSubmitButtonClass] = useState('btn-blue');
    const [editCount, setEditCount] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
  
          try {
          const result = await axios.get(STOCK_PLUNGE_URL, safeHeaders);
          console.log(result.data);
          setListData(result.data);
        } catch (error) {
          setIsError(true);
          console.log('error:', error);
        }
  
        setIsLoading(false);
        //console.log(listData);
   
      };
   
      fetchData();
    }, [editCount]);  

    
    const handleItemClick = (event, id, flag) => {
      event.preventDefault();
      listData.forEach(item =>{
        if (item.id === id) {
          setDateseq(item.dateseq);
          setItemId(id);
          setFlag(flag);
          setLoss(item.loss);
          setDuration(item.duration);
          setLast(item.last);
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
        await axios.delete(`${STOCK_PLUNGE_URL}/${itemId}`, safeHeaders);        
        setUpdateMessage('Data sucessfully removed From the database!');
        setEditCount(editCount + 1);
  
      } catch (err) {
        // Handle Error Here
        console.error(err);
        setUpdateMessage('Error encountered while writing to the database!');
      }
  
    }



    const sendPutRequest = async (newData) => {
   

        try {
          const resp = await axios.put(`${STOCK_PLUNGE_URL}/${itemId}`, newData, safeHeaders);
          
          setUpdateMessage('Data sucessfully written to the database!');
          setEditCount(editCount + 1);
          
    
        } catch (err) {
          // Handle Error Here
          console.error(err);
          setUpdateMessage('Error encountered while writing to the database!');
        }
    
      }


    const handleSubmit = (event) => {
        event.preventDefault();
        
        const sendData = {            
            dateseq: dateseq,
            loss: loss,
            duration: duration,
            last: last
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
                    <label>Date Sequence</label>
                </div>
                <div className="col-75">
                <input 
                    type="text" 
                    id = "dateseq"
                    value={dateseq} 
                    onChange={(event)=>setDateseq(event.target.value)}
                    />
                </div>
            </div>
           
            <div className="form-row">
                <div className="col-25">
                    <label>Loss Index</label>
                </div>
                <div className="col-75">
                    <input 
                    type="text" 
                    id = "loss"
                    value={loss} 
                    onChange={(event)=>setLoss(event.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-25">
                    <label>Duration</label>
                </div>
                <div className="col-75">
                    <input 
                    type="text" 
                    id = "duration"
                    value={duration} 
                    onChange={(event)=>setDuration(event.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-25">
                    <label>Last Index</label>
                </div>
                <div className="col-75">
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
                className={submitButtonClass}
                type="submit"
                onClick={handleSubmit}
                >{submitButtonText}
              </button></div>
              <div className="message-box">{updateMessage}</div>
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
             <th>Date Sequence</th>
             <th>Loss Index</th>
             <th>Duration</th>
             <th>Last Index</th>
             <th>Edit</th>
             <th>Delete</th>

        </tr>
        {listData && listData.map(item =>{
            return (
              <tr key={item.id}>
              <td>{item.dateseq}</td>              
              <td>{item.loss}</td>
              <td>{item.duration}</td>
              <td>{item.last}</td>
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

  export default SettingEditComponent;