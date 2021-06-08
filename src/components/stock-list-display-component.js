import React, { Fragment,  useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { STOCK_LIST_ITEM_URL, safeHeaders } from './api-config';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link as RouterLink } from 'react-router-dom';




const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
     
    },
  },
}));

export default function StockDisplayComponent(props) {
  const classes = useStyles();
  const [ticker, setTicker] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [affectedItem, setAffectedItem] = useState(null);


  const sendDeleteRequest = async (itemId) => {

    //ready to send to API using Axios
    
    try {
      const resp = await axios.delete(`${STOCK_LIST_ITEM_URL}/${itemId}`, safeHeaders);
      console.log(resp.data);
      setUpdateMessage('Item sucessfully deleted!');
      setAffectedItem(itemId);
      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered delete!');
    }

  }



  const sendPostRequest = async () => {
    const newStockItem = {
      ticker: ticker.toUpperCase(),
      listId: props.listId,
    };

    //ready to send to API using Axios
    console.log(newStockItem);
    try {
      const resp = await axios.post(STOCK_LIST_ITEM_URL, newStockItem, safeHeaders);
      console.log('rest data', resp.data.item_id);
      setAffectedItem(resp.data.item_id);

      setUpdateMessage('Data sucessfully submitted!');
      //history.push(`/home`);

    } catch (err) {
      // Handle Error Here
      console.error(err);
      setUpdateMessage('Error encountered updating!');
    }

  }

  const handleSubmit = (event) =>{    
    sendPostRequest();        
    event.preventDefault();
  }


  const handleDelete = (itemId) =>{    
    console.log('deleitng item id:', itemId);
    sendDeleteRequest(itemId);
    
  }



  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios.get(`${STOCK_LIST_ITEM_URL}/list/${props.listId}`, safeHeaders);
        console.log('url',`${STOCK_LIST_ITEM_URL}/list/${props.listId}`);
        setData(result.data);
        console.log(result.data);

      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      //console.log(result.data);
 
    };
 
    fetchData();
  }, [affectedItem]);  

  return (

    <Fragment>
     
   
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField id="ticker" label="Stock Symbol" value={ticker}  onChange={(event)=>setTicker(event.target.value)}/>

      <Button variant="contained" size="small"  type="submit">
        ADD
      </Button>

          <span className='error'>{updateMessage}</span>
    </form>



    {isError && <div>Something went wrong when loading API data ...</div>}
    {isLoading ? ( <div>Loading ...</div>) : (

        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                
                <TableCell>Symbol</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Exchange</TableCell>                
                <TableCell>Action</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.list_id}>
                  
                  
                  <TableCell component="th" scope="row">
                    {row.ticker}        
                    <IconButton  component={RouterLink} to={`/stockdetails/${row.ticker}`}>
                  <VisibilityIcon fontSize="small"  color="primary" /></IconButton>  


                  </TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.industry}</TableCell>
                  <TableCell>{row.exchange}</TableCell>
                  
                  <TableCell>
                  <IconButton  onClick={()=>handleDelete(row.item_id)}>
                    <DeleteForeverIcon fontSize="small"  color="secondary" /></IconButton>
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