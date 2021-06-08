import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { STOCK_LIST_ITEM_URL, STOCK_LIST_URL, safeHeaders } from './api-config.js';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ItemDataMobile from './item-data-mobile-component';
import StockSingleChartMobile from './stock-single-chart-mobile';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  symbolHeader: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: '1.2em',

  },
  container: {
    padding: theme.spacing(1),
  },
  symbolDesc:{
    fontSize: '0.9em',
    paddingLeft: theme.spacing(1),

  },
}));



export default function ListItemMobileComponent(props) {
  const classes = useStyles();
  const [itemData, setItemData] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listData, setListData] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isListError, setIsListError] = useState(false);


  const generateStockLists = () => 
  <div >
            {listData.map((list)=>        
              <Button 
                key={list.list_id}                   
                component={RouterLink}
                to={`/lists/${list.list_id}`}
              >
                {list.list_name}
              </Button>

          )}  
</div>  
  
  
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios.get(`${STOCK_LIST_ITEM_URL}/list/${props.id}`, safeHeaders);
        //console.log('url',`${STOCK_LIST_ITEM_URL}/list/${props.listId}`);
        setItemData(result.data);
        console.log(result.data);

      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      //console.log(result.data);
 
    };
 
    const fetchLists = async () => {
      setIsListError(false);
      setIsListLoading(true);

        try {
        const result = await axios.get(STOCK_LIST_URL, safeHeaders);        
        setListData(result.data);


        //console.log('list data:', result.data);
      } catch (error) {
        setIsListError(true);
        console.log('error:', error);
      }

      setIsListLoading(false);
      
 
    };
 



    fetchLists();
    fetchData();
    
  }, [props.id]);  


  return (

<Fragment>
  {isListError && <div>Something went wrong when loading API list data ...</div>}
  {isListLoading ? ( <div>Loading List...</div>) : ( <div>{generateStockLists()}</div>)}


  {isError && <div>Something went wrong when loading API data ...</div>}
  {isLoading &&  <div className={classes.root}><CircularProgress /> </div>}
     
      {itemData && itemData.map(item =>{
        return(
          <div key={item.item_id}>
            <div className={classes.container}>
            <div className={classes.symbolHeader}>{item.ticker}</div>
            <div className={classes.symbolDesc}><span>{item.company}</span><span> ({item.exchange})</span></div>
            </div>
            <ItemDataMobile ticker={item.ticker} />
            <StockSingleChartMobile ticker={item.ticker} type={'combined'}/>
          </div>
        ) 
      })}
              
   
 
    </Fragment>
  )
}

