import React, { Fragment,  useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import { STOCK_LIST_URL, safeHeaders } from './api-config';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import styled from 'styled-components';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link as RouterLink } from 'react-router-dom';

const Styles = styled.div`
  height: 80px;
  width: 98%;
  margin: 10px auto;
  border: solid 1px gray;
  .error {
    font-size: 12px;
    color: #2196f3;
  }

`



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      
    },
  },
}));

export default function StockListComponent() {
  const classes = useStyles();
  const [listName, setListName] = useState('');
  const [checked, setChecked] = useState(false);  
  const [updateMessage, setUpdateMessage] = useState('');
  const [mode, setMode] = useState('addnew');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listId, setListId] = useState(null);    
  const [buttonCaption, setButtonCaption] = useState('Save New List');   
  const [affected, setAffected] = useState(null);     

  const sendPutRequest = async () => {
    const status  = checked ? 1 : 0;
    const newStockList = {
      listName: listName,
      status: status,
    };

    //ready to send to API using Axios
    console.log(newStockList);
    try {
      const resp = await axios.put(`${STOCK_LIST_URL}/${listId}`, newStockList, safeHeaders);
      console.log(resp.data);
      setAffected(listId);
      setUpdateMessage('Data sucessfully submitted!');
      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered updating!');
    }

  }



  const sendPostRequest = async () => {
    const status  = checked ? 1 : 0;
    const newStockList = {
      listName: listName,
      status: status,
    };

    //ready to send to API using Axios
    console.log(newStockList);
    try {
      const resp = await axios.post(STOCK_LIST_URL, newStockList, safeHeaders);
      console.log(resp.data);
      setAffected(resp.data.list_id);
      setUpdateMessage('Data sucessfully submitted!');
      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered updating!');
    }

  }

  const handleSubmit = (event) =>{    
    if(mode === 'addnew') sendPostRequest();
    else if (mode === 'edit') sendPutRequest();
    
    event.preventDefault();
  }

  const resetData = () =>{   
    //console.log('resetting...') ;
    setMode('addnew');
    setButtonCaption('Save New List');
    setUpdateMessage('');
    setChecked(false);
    setListName('');
  }



  const handleEditButtonClick = (listId) =>{    
    setMode('edit');
    setButtonCaption('Save Edited List');
    setListId(listId);
    data.forEach(item =>{
        if (item.list_id === listId){
          setChecked(item.status === 0 ? false: true);
          setListName(item.list_name);
        }

    });
    //console.log('list id:', listId);
    
  }



  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

        try {
        const result = await axios.get(STOCK_LIST_URL, safeHeaders);
        setData(result.data);
      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      console.log(data);
 
    };
 
    fetchData();
  }, [affected]);  

  return (

    <Fragment>
     

  
   
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField id="list-name" label="List Name" value={listName}  onChange={(event)=>setListName(event.target.value)}/>
      <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(event)=>setChecked(event.target.checked)}
                name="status"
                color="secondary"
              />
            }
            label="Disabled"
          />

      <Button variant="contained" size="small"  type="submit">
        {buttonCaption}
      </Button>
      <Button variant="contained" size="small"  onClick={resetData}>
        Reset
      </Button>
          <span className='error'>{updateMessage}</span>
    </form>



    {isError && <div>Something went wrong when loading API data ...</div>}
    {isLoading ? ( <div>Loading ...</div>) : (

        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                
                <TableCell>List No</TableCell>
                <TableCell>List Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell>Action</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.list_id}>
                  
                  
                  <TableCell component="th" scope="row">
                    {row.list_id}
                    <IconButton  component={RouterLink} to={`/lists/${row.list_id}`}>
                  <VisibilityIcon fontSize="small"  color="primary" /></IconButton>  

                    
                  </TableCell>
                  <TableCell>{row.list_name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{moment(row.created_at).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{moment(row.updated_at).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                  <IconButton  onClick={()=>handleEditButtonClick(row.list_id)}>
                    <EditIcon fontSize="small"  color="primary" /></IconButton>
                  </TableCell>      

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
}