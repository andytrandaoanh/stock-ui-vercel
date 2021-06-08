import React, { Fragment,  useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { DATA_FILE_URL, FILE_PROCESS_URL, safeHeaders } from './api-config.js';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';




const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  table: {

    minWidth: 650,
  },
}));



export default function DenseTable() {
  const classes = useStyles();
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const sendPostRequest = async (id) => {
    
    const requestData = {
      fileId: id
    };

    //ready to send to API using Axios
    //console.log(newTerm);
    try {
      const resp = await axios.post(FILE_PROCESS_URL, requestData, safeHeaders);
      console.log('Server response: ', resp);
      setUpdateMessage(resp.data.message);
      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.log('error:', err);
      setUpdateMessage('Error encountered while prcessing data!');
    }

  }


  const handleClick = (id) =>{
    //console.log(id);
    setUpdateMessage(`Processing file id ${id}...`);
    sendPostRequest(id);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

        try {
        const result = await axios.get(DATA_FILE_URL, safeHeaders);
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


  return (
    <Fragment>
      <Alert severity="success">
        {updateMessage}
      </Alert>


    {isError && <div>Something went wrong when loading API data ...</div>}
    {isLoading ? ( <div>Loading ...</div>) : (
      
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            
            <TableRow>              
              <TableCell>Action</TableCell>
              <TableCell>Original Name</TableCell>
              <TableCell >Mime Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Processed</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {listData.map((row) => (
              <TableRow key={row.file_id}>
                <TableCell component="th" scope="row">
                <Button 
                  size="small"
                  variant="outlined" 
                  color="primary" 
                  key={`button${row.file_id}`}
                  onClick={() => handleClick(row.file_id)}
                  disabled = {row.status ? true : false}
                  >
                  Process
                </Button>
                </TableCell>
                <TableCell>{row.original_name}</TableCell>
                <TableCell>{row.mime_type}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{moment(row.created_at).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{moment(row.updated_at).format('DD/MM/YYYY')}</TableCell>
                
 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
    </Fragment>
  );
}


