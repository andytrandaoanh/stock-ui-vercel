import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { TRANSACTIONS_TICKER_URL, safeHeaders } from './api-config.js';
import styled from 'styled-components';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    greenNum: {
        color: 'green',
        textAlign: 'right',
    },
    redNum: {
        color: 'red',
        textAlign: 'right',
    },
    yellowNum: {
      color: 'orange',
      textAlign: 'right',
    },   
    leftCell: {
        textAlign: 'left',
    },
    rightCell: {
        textAlign: 'right',
    },

    
  }));

const Styles = styled.div`

table {
    border-collapse: collapse;
    margin: 10px;
    font-family: sans-serif;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    font-size: 0.9em;

}

th, td {
    padding: 12px;

}


`


export default function ItemDataMobileComponent(props) {
    const classes = useStyles();    
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const backDate =120;

      
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {

        
        let today = new Date();
        today.setDate(today.getDate() - backDate);
        //let newDay = today.getDate();
        let mindate = `${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}` 

        //console.log('mindate', mindate);

        const result = await axios.get(
          `${TRANSACTIONS_TICKER_URL}?ticker=${props.ticker}&mindate=${mindate}`, safeHeaders);
     
        //console.log(result.data);
        const rData = result.data.reverse();
        const newData = [];
        const total = rData.length -1 > 10 ? 10 : rData.length -1 > 10;
        for (let i = 0; i < total ; i ++ ){

            let date = moment(rData[i].date).format('DD/MM/YYYY');
            let volume =rData[i].volume;
            let close = Math.floor(rData[i].close * 1000);
            let lastClose = Math.floor(rData[i+1].close * 1000);
            newData.push({date, volume, close, lastClose})

        }
        setData(newData);

      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      //console.log(result.data);
 
    };
 
    fetchData();
  }, [props.ticker]);  

    return (
      <Fragment>
      {isError && <div>Something went wrong when loading API data ...</div>}
      {isLoading ? ( <div>Loading ...</div>) : (
          <Styles>
              <table>
                  <tr>
                      <th className={classes.leftCell}>Date</th>
                      <th>Close</th>
                      <th>+/-</th>
                      <th>Percent</th>
                      <th className={classes.rightCell}>Volume</th>
                      
                  </tr>
              
              {data && data.map((item, index)=>{
                const colorStyle = item.close === item.lastClose ? classes.yellowNum : (item.close > item.lastClose ? classes.greenNum : classes.redNum);
                return(
                <tr key={item.date}>
                      <td>{item.date}</td>
                      <td 
                      className={colorStyle}
                      >
                       <NumberFormat 
                        value={item.close} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale = {0}
                        prefix={''} />
                      
                      </td>
                      <td className={colorStyle}>
                          {item.close - item.lastClose}</td>
                      <td className={colorStyle}>
                      <NumberFormat 
                       suffix={'%'}
                        value={(item.close - item.lastClose)/item.lastClose*100} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale = {2}
                         />


                          
                     </td>
                      <td className={classes.rightCell}>
                          <NumberFormat 
                        value={item.volume} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale = {0}
                        prefix={''} />
                     </td>
                     
                </tr>
                )  
                


              })}
              </table>
          </Styles>
    
      )}
    </Fragment>
    )
}