import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { INDEX_LIST_URL, safeHeaders } from './api-config.js';
import styled from 'styled-components';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
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

caption {
    margin: 10px;
    font-size: 1.1em;
}

.chart-container {
  width: 480px;
  height: 420px;
}

`





export default function IndexDataMobileComponent() {
    const classes = useStyles();    
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [ticker, setTicker] = useState('VNINDEX');
    const backDate = 60;
    const indexList = ['VNINDEX', 'HNX-INDEX', 'UPCOM-INDEX', 'VN30INDEX'];


      
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
            `${INDEX_LIST_URL}/search?ticker=${ticker}&mindate=${mindate}`, safeHeaders);


        console.log(result.data);
        const rData = result.data.reverse();
        const newData = [];
        const total = rData.length -1 > 10 ? 10 : rData.length -1;
        for (let i = 0; i < total ; i ++ ){

            let date = moment(rData[i].date).format('DD/MM/YYYY');
            let volume =rData[i].volume;
            let close = rData[i].close;
            let lastClose = rData[i+1].close;
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
  }, [ticker]);  

    return (
      <Fragment>
      {isError && <div>Something went wrong when loading API data ...</div>}
      {isLoading ? ( <div>Loading ...</div>) : (
          <Styles>
              <div className={classes.root}>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
              {indexList.map(item=>{
                return <Button onClick={(event)=>setTicker(item)}>{item}</Button>
              })}
              </ButtonGroup>
              </div>
              <table>
                  <caption>{ticker}</caption>
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
                        decimalScale = {2}
                        prefix={''} />
                      
                      </td>
                      <td className={colorStyle}>
                      <NumberFormat 
                        value={item.close - item.lastClose} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale = {2}
                        prefix={''} />

                      </td>
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