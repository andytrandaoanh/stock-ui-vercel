import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import styled from 'styled-components';
import axios from 'axios';
import { STOCK_DETAIL_URL, STOCK_NOTES_URL, safeHeaders } from './api-config';
import CircularProgress from '@material-ui/core/CircularProgress';



const Styles = styled.div`
.container {
  padding: 10px;
  width: 100%;
}

.column-left {
  float: left;
  width: 60%;
}

.column-right {
  float: left;
  width: 40%;
}


/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}


.row-title {
  font-weight: bold;
  display: inline-block;
  width: 120px;
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

.btn-submit-red {
  background-color: red; 
  border: none; 
  color: white; 
  padding: 5px; 
  font-size: 12px; 
  cursor: pointer; 
  border-radius: 5px;
  width: 100px;
  margin-left: 5px;
  

}


.btn-submit-red:hover {
  background-color: #5e35b1;
}

.small-button {
  font-size: 11px;
  color: white; 
  margin: 2px;
  padding: 2px 8px;
  border-radius: 3px;
  border: none;
  background-color: #1769aa; 
}

.small-button:hover {  
  background-color: #5e35b1;
}


.text-note {
  width: 90%;
  height: 120px;
}


.form-control {
 margin: 10px;
 
}

.form-container {
  width: 100%;
  margin: 0px 20px;
  text-align: center;
}

.text-box {

  width: 40%;
  padding: 5px 10px;  
  border: none;
  border-bottom: 1px solid steelblue;

}

.message-box {
  font-size: 10px;
  color: steelblue;
}

.intext-btn {
  font-size: 14px;
  color: #1769aa; 
  margin: 2px;
  padding: 2px 8px;
  border-radius: 3px;
  border: none;
  background-color: white; 
}

.intext-btn:hover {
  background-color: #f1f1f1;
}

ul {
  list-style-type: none;
}

`
export default function StockDetailTab1Component(props) {
  const textAddNew = "Add New Note";
  const textDelete = "Delete Note";
  const textEdit = "Save Change";
  const buttonClassBlue = "btn-submit";
  const buttonClassRed = "btn-submit-red";

  const [data, setData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [buttonText, setButtonText] = useState(textAddNew);
  const [buttonClass, setButtonClass] = useState(buttonClassBlue);
  const [noteId, setNoteId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
 
  const getNoteContent = (noteId) =>{
    notes.forEach((item, index) =>{
      if (item.id === noteId) {setNewNote(notes[index].note)}
    })
  }


  const resetButton = (event) =>{
    event.preventDefault();
    setButtonClass(buttonClassBlue) ;
    setButtonText(textAddNew);
    setNewNote('');
    setNoteId(null);

  }

  const handeDelete = (event, noteId) => {
    event.preventDefault();
    setNoteId(noteId);
    getNoteContent(noteId);
    setButtonText(textDelete);
    setButtonClass(buttonClassRed);
    
    console.log('deleting ', noteId);
  }

  const handeEdit = (event, noteId) => {
    event.preventDefault();
    setNoteId(noteId);
    getNoteContent(noteId);
    setButtonText(textEdit);
    setButtonClass(buttonClassBlue);
    console.log('editing ', noteId);
  }

  const sendDeleteRequest = async () => {
    
    //ready to send to API using Axios
    //console.log(newTerm);
    try {
      const resp = await axios.delete(`${STOCK_NOTES_URL}/${noteId}`, safeHeaders);
      console.log(resp.data);

      //remove from state array
      let array = [...notes]; // make a separate copy of the array
      let itemIndex = null;

      array.forEach((item, index) =>{
        if (item.id === noteId) {
          itemIndex = index;
        }

      })

      array.splice(itemIndex, 1);

      setNotes(array);


      setUpdateMessage('Data sucessfully written to the database!');
      

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
      const resp = await axios.put(`${STOCK_NOTES_URL}/${noteId}`, newData, safeHeaders);
      console.log(resp.data);
      
      let array = [...notes]; // make a separate copy of the array

      array.forEach((item, index) =>{
        if (item.id === noteId) {
          array[index] = newData;
        }

      })

      setNotes(array);
      //setData(newData);

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
      const resp = await axios.post(STOCK_NOTES_URL, newData, safeHeaders);
      console.log(resp.data);
      setUpdateMessage('Data sucessfully written to the database!');
      setNotes([...notes, newData]);
      

      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered while writing to the database!');
    }

  }




  const handleClick = (event) =>{
    event.preventDefault();
    console.log('user add note', newNote);
    const sendData = {
      tickerId: data.id,
      note: newNote
  }
  //console.log(sendData);	
  if (buttonText === textAddNew) {
    sendPostRequest(sendData);
  }
  else if  (buttonText === textEdit){
    sendPutRequest(sendData);
  } 	 
  
  else if (buttonText === textDelete){
    sendDeleteRequest();
  }

  


  }

  useEffect(() => {
    
    const fetchNotes = async (tickerid) =>{
      //console.log('url', `${STOCK_NOTES_URL}/search?tickerid=${tickerid}`);
      
      try {
        
        const result = await axios.get(`${STOCK_NOTES_URL}/search?tickerid=${tickerid}`, safeHeaders);
        console.log('notes', result.data);
        setNotes(result.data);
        setUpdateMessage('');

      } catch (error) {
        //setIsError(true);
        setNotes(null);
        console.log('error:', error);
      }
      


    }

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

        try {
        const result = await axios.get(`${STOCK_DETAIL_URL}/search?ticker=${props.ticker}`,safeHeaders);
        //console.log(result.data);
        setData(result.data[0]);
        fetchNotes(result.data[0].id)

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
        
          <div className="row">
            <div className="column-left">
            <div className="container">
            <p><span className="row-title">Symbol</span><span className="row-data">{data.ticker.toUpperCase()}</span></p>
            <p><span className="row-title">Company</span><span className="row-data">{data.company}</span></p>
            <p><span className="row-title">Exchange</span><span className="row-data">{data.exchange}</span></p>
            <p><span className="row-title">Industry</span><span className="row-data">{data.industry}</span></p>
            <p><span className="row-title">Notes</span><span className="row-data"></span></p>
            


          </div>
          </div>
          <div className="column-right">
          


          </div>
          </div>

          
        
      }

            {notes && <ul>
                  {notes.map(item =>{

                  return(
                  <li key={item.id}>
                    {item.note}
                  </li>)
                  })}
              
              </ul>}


    </Styles>        
      );



} 