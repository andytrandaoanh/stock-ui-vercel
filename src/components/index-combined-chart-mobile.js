import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { INDEX_LIST_URL, safeHeaders } from './api-config.js';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import CombinedChart from '../charts/combined-chart-mobile-v1';
import * as d3 from 'd3';


function ChartContainer(props) {
  const [data, setData] = useState([]);
    const parseDate = d3.utcParse("%Y-%m-%d");

    const d3Data = [];
    useEffect(() => {
    
      props.data.forEach(d =>{
        d3Data.push({
          date : parseDate(d.date), 
          open: +d.open,            
          close : +d.close,
          high: +d.high,
          low: +d.low,
          volume: +d.volume
        });

      setData(d3Data);

      });
 
        
    }, [props.data]);


    return (
        <div>
         
            <CombinedChart width={480} height={420} data={data} />
            
            
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
 
    
  }));

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



export default function TransactionTicker() {
    const classes = useStyles(); 
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [backDate, setBackDate] = useState(60);
    const [ticker, setTicker] = useState('VNINDEX');
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
            <div className={classes.root}>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
              {indexList.map(item=>{
                return <Button onClick={(event)=>setTicker(item)}>{item}</Button>
              })}
              </ButtonGroup>
            </div>


          <div className="chart-title">{ticker.toUpperCase()} {backDate} <span>DAYS</span>
          <button className="chart-button" onClick={()=>{setBackDate(2 * 30)}}>2M</button>
          <button className="chart-button" onClick={()=>{setBackDate(4 * 30)}}>4M</button>
          <button className="chart-button" onClick={()=>{setBackDate(6 * 30)}}>6M</button>
          
          </div>
          
          <ChartContainer  data={data} />
          </Styles>
    
      )}
    </Fragment>
    )
}