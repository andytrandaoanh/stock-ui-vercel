import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { INDEX_LIST_URL, safeHeaders } from './api-config.js';
import ChartContainer from './candlestick-chart-container-v1';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';



const Styles = styled.div`

.chart-title {
  font-size: 12px;
  float: right;
  font-weight: bold;
  color: #1769aa;
  margin-top: 5px;
  margin-right: 5px;
  .span {padding-top: 2px;}
}

.chart-button {
  font-size: 8px;
  margin: 2px;
  border-radius: 3px;
}
.chart-button:hover{
  color: "white";
  background: "#1769aa";
}
.link-button {
  padding: 0px 2px;
  text-decoration: none;
}


`


export default function IndexValueChartComponent() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [backDate, setBackDate] = useState(120);
    const [ticker, setTicker] = useState('VNINDEX');

    const symbolList = ['VNINDEX', 'HNX-INDEX', 'UPCOM-INDEX', 'VN30INDEX'];

    
    const generateButtons = () => 
    
    <div>

            {symbolList.map((item)=>        
                <Button 
                                     
                  onClick = {(event)=>setTicker(item)}
                >
                  {item}
                </Button>

            )}
    </div>


    
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {

        
        let today = new Date();
        today.setDate(today.getDate() - backDate);
        //let newDay = today.getDate();
        let mindate = `${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}` 

        console.log('mindate', mindate);

        const result = await axios.get(
          `${INDEX_LIST_URL}/search?ticker=${ticker}&mindate=${mindate}`, safeHeaders);
     
        //console.log(result.data);
        setData(result.data);

      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      //console.log(result.data);
 
    };
 
    fetchData();
  }, [ticker, backDate]);  

    return (
      <Fragment>
      {isError && <div>Something went wrong when loading API data ...</div>}
      {isLoading ? ( <div>Loading ...</div>) : (
          <Styles>
          {generateButtons()}
          <div className="chart-title">{ticker.toUpperCase()} {backDate} <span>DAYS</span>
          <button className="chart-button" onClick={()=>{setBackDate(4 * 30)}}>4M</button>
          <button className="chart-button" onClick={()=>{setBackDate(6 * 30)}}>6M</button>
          <button className="chart-button" onClick={()=>{setBackDate(12 * 30)}}>12M</button>
          <button className="chart-button" onClick={()=>{setBackDate(18 * 30)}}>18M</button>
          <button className="chart-button" onClick={()=>{setBackDate(24 * 30)}}>24M</button>
          </div>
          
          <ChartContainer  data={data} />
          </Styles>
    
      )}
    </Fragment>
    )
}