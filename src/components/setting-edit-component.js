import React, { Fragment, useState, useEffect } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { SYSTEM_SETTINGS_URL, safeHeaders } from './api-config.js';
import Checkbox from '@material-ui/core/Checkbox';





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
    const [sysKey, setSysKey] = useState('');
    const [value, setValue] = useState('');    
    const [check, setCheck] = useState(false);
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
          const result = await axios.get(SYSTEM_SETTINGS_URL, safeHeaders);
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
    }, [editCount]);  

    
    const handleItemClick = (event, id, flag) => {
      event.preventDefault();
      listData.forEach(item =>{
        if (item.id === id) {
          setSysKey(item.syskey);
          setItemId(id);
          setFlag(flag);
          setValue(item.value);
          setCheck(item.status === 0 ? false : true);
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
        await axios.delete(`${SYSTEM_SETTINGS_URL}/${itemId}`, safeHeaders);        
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
          const resp = await axios.put(`${SYSTEM_SETTINGS_URL}/${itemId}`, newData, safeHeaders);
          
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
            syskey: sysKey,
            value: value,
            status: check ? 1 : 0,
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
           
            <div className="form-row">
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
            <div className="form-row">
                <div className="col-25">
                    <label>Status</label>
                </div>
                <div className="col-75">
                <Checkbox
                  checked={check}
                  onChange={(event)=>setCheck(event.target.checked)}
                  
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
             <th>System Key</th>
             <th>Value</th>
             <th>Status</th>
             <th>Edit</th>
             <th>Delete</th>

        </tr>
        {listData && listData.map(item =>{
            return (
              <tr key={item.id}>
              <td>{item.syskey}</td>              
              <td>{item.value}</td>
              <td>{item.status}</td>
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