import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { DASHBOARD_TOPMOVERS_URL, safeHeaders } from './api-config.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  
  greenText: {
    color: 'green',
  },

  redText: {
    color: 'red',
  },

  yellowText: {
    color: 'orange',
  },

  dataTable: {
    width: 400,
    textAlign: 'right',
  },

  tickerColumn: {
    textAlign: 'left',
  }

}));

export default function HomePageComponent() {
  const classes = useStyles();
  const [data, setData] = useState(null);  
  const [isError, setIsError] = useState(false);
    
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      

        try {
        const result = await axios.get(DASHBOARD_TOPMOVERS_URL, safeHeaders);
        setData(result.data);
        //console.log('data', result.data);
      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

     
 
    };
 
 
 
   fetchData();
  }, []);  




    return(
    <Fragment>
      {isError && <div>Something went wrong when loading API data ...</div>}
      { data === null ? <div className={classes.root}><CircularProgress /> </div> : 
      
      (

    <table className={classes.dataTable}>
      {data.map(item =>{
          
          return (

            <tr  key={item.ticker}>
            
            <td className={classes.tickerColumn}>{item.ticker}</td>    
            <td>
                <NumberFormat 
                  className={item.closeChange === 0.0 ? classes.yellowText: (item.closeChange < 0 ? classes.redText: classes.greenText)} 
                  value={item.close } displayType={'text'} thousandSeparator={true} /> 
            </td>      
            <td>
                <NumberFormat 
                  className={item.closeChange === 0.0 ? classes.yellowText: (item.closeChange < 0 ? classes.redText: classes.greenText)} 
                  value={item.closeChange * 100}               
                  decimalScale={2} displayType={'text'} suffix={'%'}/>
            </td>      
            <td>
                
                <NumberFormat value={item.volume} displayType={'text'} thousandSeparator={true} />  
    
            </td>
                


            
            </tr>


          )

      })}
      </table>
      
      )}
      
      

      </Fragment>
    )
}
