import React, { useEffect, useState } from 'react';
import Chart from '../charts/candlestick-chart-v1.3';
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
            <Chart width={800} height={280} data={data} />
        </div>
    );
};

export default ChartContainer;

