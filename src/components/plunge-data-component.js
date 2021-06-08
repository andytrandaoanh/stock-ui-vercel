import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { STOCK_PLUNGE_URL, safeHeaders } from './api-config.js';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    greenNum: {
        color: 'green',
        textAlign: 'right',
    },
    redNum: {
        color: 'red',
        
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

td {text-align: right;}

caption {
    margin: 10px;
    font-size: 1.1em;
}


`


export default function PlungeDataComponent(props) {
    const classes = useStyles();    
    const [data, setData] = useState([]);
    const [averageLoss, setAverageLoss] = useState([null]);
    const [averagePercent, setAveragePercent] = useState([null]);
    const [averageDuration, setAverageDuration] = useState([null]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    

  function convertDate(dateseq) {
    let newString = String(dateseq);
    let yearPart = newString.substring(0,4); 
    let monthPart = newString.substring(4,6); 
    let dayPart = newString.substring(6); 
    return `${dayPart}-${monthPart}-${yearPart}`;
  }
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {


  
        const result = await axios.get(STOCK_PLUNGE_URL, safeHeaders);

        //console.log(result.data);
        
        let totalDuration = 0;
        let totalLoss = 0;
        let totalPercent = 0;
        let i = 0;
        let newData = [];

        for (i ; i < result.data.length ; i ++ ){
          let percent = (result.data[i].loss - result.data[i].last) * 100 / result.data[i].last;          
          totalDuration += result.data[i].duration;
          totalPercent += percent; 
          totalLoss += (result.data[i].loss - result.data[i].last);
          newData.push({
            dateseq: result.data[i].dateseq,
            loss: result.data[i].loss,
            last: result.data[i].last,
            percent: percent,
            duration: result.data[i].duration
            
          })

        }

        setAverageDuration(Math.ceil(totalDuration/i));
        setAveragePercent((totalPercent/i).toFixed(2));
        setAverageLoss((totalLoss/i).toFixed(2));

        
        setData(newData);
        setIsLoading(false);



      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

     
      //console.log(result.data);
 
    };
 
    fetchData();
  }, [props.ticker]);  

    return (
      <Fragment>
      {isError && <div>Something went wrong when loading API data ...</div>}
      {isLoading ?  <div>Loading ...</div> :
      (
          <Styles>
              
              <table>
                  <caption>{props.ticker}</caption>
                  <tr>
                      <th className={classes.leftCell}>Date</th>
                      <th>Percent</th>
                      <th>Loss</th>
                      <th>Days</th>                      
                      <th>Index</th>  
                      
                      
                  </tr>
              
              {data.map((item, index)=>{
                
                return(
                <tr key={item.id}>
                      <td>{convertDate(item.dateseq)}</td>                      
                      <td className={classes.redNum}>
                        {item.percent.toFixed(2)}%
                      </td>
                      <td className={classes.redNum}>
                      {(item.loss - item.last).toFixed(2)}
                                            
                      </td>
                      <td><span className={classes.greenNum}>{item.duration}</span></td>
                      <td>
                      {item.loss.toFixed(2)}
                      

                    </td>
                </tr>
                )  
                

              })}

            <tfoot>
              <tr key="footer">
                <td>Average</td>
                <td >
                  {averagePercent}%
                      

                </td>
                <td>
                {averageLoss}
                </td>
                <td>
                 
                {averageDuration}
                  </td>
                <td></td>
                
              </tr>
            </tfoot>
            </table>
          </Styles>

          )}
    
      
    </Fragment>
    )
}