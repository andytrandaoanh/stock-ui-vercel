import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackupIcon from '@material-ui/icons/Backup';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { FILE_UPLOAD_URL, MAX_TRANS_DATES_URL, safeHeaders, safeHeadersMultiPart } from './api-config';
import styled from 'styled-components';



const Styles = styled.div`
.container {
  border-radius: 5px;  
  border: 1px solid #f2f2f2;
  padding: 20px;
  margin: 20px auto;
  width: 50%;
  height: 380px;
  text-align: center;
}

.childbox {
  padding: 10px;
}


.btn-blue {
  background-color: #1565c0; 
  border: none; 
  color: white; 
  padding: 10px 16px; 
  font-size: 16px; 
  cursor: pointer; 
  border-radius: 5px;
  width: 200px;
}


.btn-blue:hover {
  background-color: #2196f3;
} 

input[type="file"] {
  display: none;
}

.filePath {
  height: 80px;  
  width: 80%;
  border: 1px solid #ccc;
  margin: 12px auto;
  background-color: #f2f2f2;
  padding: 12px;
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

.load-message {
  text-align: center;
  width: 100%;
  margin: auto;
}

`




export default function PhotoUploadComponent() {

  const [data, setData] = useState([]);
  const [uploadMessage, setUploadMesage] = useState(null);
  const [selectFiles, setSelectFiles] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [isError, setIsError] = useState(false);
  


  const handleChange = (event) => {
    
      const files = []

      for(let i=0; i<event.target.files.length; i++) {
        files.push(event.target.files[i].name);
      }
  
      setFileNames(files);
      console.log(event.target.files);
      setSelectFiles(event.target.files);      
      setShowButton(true);
      event.preventDefault();
  }	



  const sendPostRequest = async () => {
      
      const formData = new FormData();      

      for(let i=0; i < selectFiles.length; i++) {        
        formData.append("files", selectFiles[i]);
      }

        

        try {
          const res = await axios.post(
            FILE_UPLOAD_URL, 
            formData,
            safeHeadersMultiPart
          );

          //setUploadRedirect('/edit/' + res.data.photo_id.toString());
          setUploadMesage("Files successfully uploaded");

        } catch (error) {
          setIsError(true);
          setUploadMesage("Errors encountered while uploading files");

        }

   
    };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendPostRequest();	  	  

  };	

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);


        try {
        const result = await axios.get(MAX_TRANS_DATES_URL, safeHeaders);
        setData(result.data);
        //console.log(result.data)
      } catch (error) {
        setIsError(true);
        //console.log('error:', error);
      }


 
    };
 
    fetchData();
  }, []);  

	return (
    
    <Styles>

      {isError ? <div className="load-message">Something went wrong checking data ...</div> :
        <div className="load-message">SYSTEM CHECK MESSAGE: "{data.message}"</div>
      }
      
      <div className="container">
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="childbox">
          <label className="btn-blue">
            <input type="file" accept=".csv" name="datafile" multiple  onChange={handleChange}/>
            <FileCopyIcon  fontSize="small"/> Select File
          </label>
        </div>
        {fileNames? 
          <div className="filePath">
                  
                {fileNames.map(fileName =>( 
                    <div>{fileName}</div>
                ))}
    
          </div>
        : null}
         <div>
          {showButton ?         
           <button className="btn-red" type="submit"><BackupIcon /> Upload</button>
           : null}
        </div>        
        <div>{uploadMessage}</div>
       </form>
      </div>
      
      </Styles>

	)
}
