//original chart made by Mike Bostock
//changes made by Andy Tran 29 November 2020
//move yAxis to the left


import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';


const Styles = styled.div`
.chart {
  font-size: 10px;

}

.grid path {
  stroke-width: 0;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  stroke-dasharray: 2,2;
}

.tooltip {
  font-size: 16px;
}



`



export default function LineChart(props){
    const ref = useRef();
    

    useEffect(() => {

      if (props.data[0])  draw(props.data);
         

    }, [props.data]);

    function calculateSMA(data, N) {
      //let values = [];
      //data.forEach(d =>{values.push(d.close)});

      //console.log('calculating sma...', data[0]);
      let sma = [];
      let i = 0;
      let sum = 0;

      const means = new Array(data.length).fill(NaN);
      
      
      for (let n = Math.min(N - 1, data.length); i < n; ++i) {
        sum += data[i].close;
      }


      for (let n = data.length; i < n; ++i) {
        sum += data[i].close;
        means[i] = +d3.format("~f")(sum / N);
        sum -= data[i - N + 1].close;
      }
      
      for (let i = 0; i < data.length; ++i) {
        
        if (means[i]) {
          sma.push(
            { date: data[i].date, 
              value: means[i]        
          })
  
        }
      }
      
      return sma
      


    }



    const draw = (data) => {
      const margin = {top: 20, right: 60, bottom: 30, left: 10};
      const {width, height} = props;
        
      //set the view port for chart
      const svg = d3.select(ref.current)
      .attr("viewBox", [0, 0, width, height]);

      const x = d3.scaleBand()
      .domain(d3.utcDay
      .range(data[0].date, +data[data.length - 1].date + 1)
      .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
      .range([margin.left, width - margin.right])
      .padding(0.2)
        
      const y = d3.scaleLog()
      .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
      .rangeRound([height - margin.bottom, margin.top])

      const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
      .tickValues(d3.utcMonday
      .every(width > 720 ? 1 : 2)
      .range(data[0].date, data[data.length - 1].date))
      .tickFormat(d3.utcFormat("%-d/%-m")))
      .call(g => g.select(".domain").remove())

      svg.append("g")
      .call(xAxis)


      // gridlines in y axis function
      function makeHorizontalGridlines() {		
        return d3.axisLeft(y)
            .ticks(5)
      }

        // add the Y gridlines
        svg.append("g")			
          .attr("class", "grid")
          .call(makeHorizontalGridlines()
              .tickSize(-width)
              .tickFormat("")
          )

 

    const yAxis = g => g
    .attr("transform", `translate(${width - margin.right}, 0)`)
    .call(d3.axisRight(y)
    .tickFormat(d3.format("~f"))
    .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))


    svg.append("g")
      .call(yAxis);



    //drawing the wicks
    const g = svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x(d.date)},0)`);
      g.append("line")
      .attr("stroke-linecap", "square")
      .attr("stroke-width", "0.5")
      .attr("stroke", d =>(d.close > d.open ? "green" : "red" ))
      .attr("y1", d => y(d.low))
      .attr("y2", d => y(d.high));

    //drawing the candles
      g.append("line")
      .attr("stroke-linecap", "round")
      .attr("y1", d => y(d.open))
      .attr("y2", d => y(d.close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
      : d.close > d.open ? d3.schemeSet1[2]
      : d3.schemeSet1[8]);


      const formatDate = d3.utcFormat("%-d/%-m/%Y");
      const formatValue = d3.format(".2f");
      
      const formatChange = (y0, y1) =>  {
        const formatPercent = d3.format("+.2%");
        return formatPercent((y1 - y0) / y0);
      }
      
      //tool-tips using native SVG  
      g.append("title")
      .text(d => `${formatDate(d.date)}
      Open: ${formatValue(d.open)}
      Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
      Low: ${formatValue(d.low)}
      High: ${formatValue(d.high)}`);

    //drawing simple moving average lines


      const ma5data = calculateSMA(data, 5);
      const ma20data = calculateSMA(data, 20);
      const ma5Color = "LawnGreen";
      const ma20Color = "green";

      //console.log('ma5', ma5data);
      //console.log('data', data)

      

      svg.append("path")
      .datum(ma5data)
      .attr("fill", "none")
      .attr("stroke", ma5Color)
      .attr("stroke-width", 0.8)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )

      
      svg.append("path")
      .datum(ma20data)
      .attr("fill", "none")
      .attr("stroke",ma20Color)
      .attr("stroke-width", 0.8)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )

      svg.append("text").attr("x", margin.left).attr("y", margin.top).attr("fill", ma5Color).text("MA5");
      svg.append("text").attr("x", margin.left + 40).attr("y", margin.top).attr("fill", ma20Color).text("MA20");

      svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 1.5])
      .on("zoom", zoomed));

      function zoomed({transform}) {
        svg.attr("transform", transform);
      }

      }
      



    

    return (
      <Styles>
        <svg ref={ref} className={'chart'}></svg>
      </Styles>

    )

}

