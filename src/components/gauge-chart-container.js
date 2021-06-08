import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { STOCK_PLUNGE_URL, safeHeaders } from './api-config.js';
import GaugeChart from '../charts/gauge-chart-v1.1';
import styled from 'styled-components';


const Styles = styled.div`
.container {
    width: 400px;    
}

.caption {
  width: 400px;    
  text-align: center;

}

`

function ChartContainer(props) {
    const maxValue = 45;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
         
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {

  
        const result = await axios.get(
          `${STOCK_PLUNGE_URL}/search?dayspassed=yes`, safeHeaders);
     
        //const days = parseInt(result.data.daysPassed);
        //console.log(days < maxValue ? days : maxValue);
        setData(result.data);
        

      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      //console.log(result.data);
 
    };
 
    fetchData();
  }, []);  




    return (
        <Fragment>
        {isError && <div>Something went wrong when loading API data ...</div>}
        {isLoading ? ( <div>Loading ...</div>) : (
  
        <Styles>
            <div className='container'>
            <GaugeChart 
                clipWidth={300} 
                clipHeight={300}                 
                size={300}
                ringWidth= {60}
                value={data.daysPassed < maxValue ? data.daysPassed : maxValue} 
                maxValue= {maxValue}                       
            />
            <div className="caption">{data.daysPassed} days passed since {data.daySince}/{data.monthSince}/{data.yearSince}</div>
            </div>
        </Styles>
        )}
        </Fragment>
    );
};

export default ChartContainer;

