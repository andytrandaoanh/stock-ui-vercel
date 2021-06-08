//original chart made by Mike Bostock
//changes made by Andy Tran 29 November 2020:
//1-move yAxis to the left
//changes by Andy Tran 30 November 2020:
//2-add moving average lines
//zoom only on x-Axis


import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';


const Styles = styled.div`
.chart {
  font-size: 8px;
}

.grid path {
  stroke-width: 0;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  stroke-dasharray: 2,2;
}


`



export default function CandleStickChart(props){
    const ref = useRef();
    

    useEffect(() => {

      if (props.data[0])  draw(props.data);
         

    }, [props.data]);

    function calculateSMA(data, N) {

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

      //create x axis, adding class for zoom operations
      //set font size and color
      //set format like 12/9
      const xAxis = g => g
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .style("font-size", "8px")
      .style("color", "dimgray")
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
    .style("font-size", "8px")
    .style("color", "dimgray")
    .call(d3.axisRight(y)
    .tickFormat(d3.format("~f"))
    .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))

    svg.append("g")
      .call(yAxis);

    //drawing the wicks
    const g = svg.append("g")
      .attr("class", "wick")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x(d.date)},0)`);
      g.append("line")
      .attr("class", "wick-line")
      .attr("stroke-linecap", "square")
      .attr("stroke-width", x.bandwidth()/10)
      .attr("stroke", d =>(d.close > d.open ? "green" : "red" ))
      .attr("y1", d => y(d.low))
      .attr("y2", d => y(d.high));

      var tooltip = d3.select("body")
      .append("div")
      .attr("class", "custom-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "lightyellow")
      .style("border", "solid 1px gray")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      


    //drawing the candles
      g.append("line")
      .attr("class", "stick")
      .attr("stroke-linecap", "round")
      .attr("y1", d => y(d.open))
      .attr("y2", d => y(d.close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
      : d.close > d.open ? d3.schemeSet1[2]
      : d3.schemeSet1[8])
      .on("mouseover", 
      function(event, d){ 
        return (
          tooltip.style("visibility", "visible")
          .html(`
            <span><strong>${formatDate(d.date)}</strong></span><br>
            <span>Open: ${formatValue(d.open)}</span><br>
            <span>Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})</span><br>
            <span>High: ${formatValue(d.high)}</span><br>
            <span>Low: ${formatValue(d.low)}</span>


          `)
        )           
      })
      .on("mousemove", function(event){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


      const formatDate = d3.utcFormat("%-d/%-m/%Y (%A)");
      const formatValue = d3.format(".2f");
      
      const formatChange = (y0, y1) =>  {
        const formatPercent = d3.format("+.2%");
        return formatPercent((y1 - y0) / y0);
      }
      
    //Calculate MA data

      const ma5data = calculateSMA(data, 5);
      const ma20data = calculateSMA(data, 20);
      const ma5Color = "LawnGreen";
      const ma20Color = "green";
      const space = 20;

    //Draw MA5 and MA20 lines

      svg.append("path")
      .attr("class", "ma5")
      .datum(ma5data)
      .attr("fill", "none")
      .attr("stroke", ma5Color)
      .attr("stroke-width", 0.8)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )

      
      svg.append("path")
      .attr("class", "ma20")
      .datum(ma20data)
      .attr("fill", "none")
      .attr("stroke",ma20Color)
      .attr("stroke-width", 0.8)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )

      //legends for moving averages
      //including a rectangle and a text for each MA
      svg.append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top - space)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", ma5Color)

      svg.append("text")
      .attr("x", margin.left + (space * 0.6 ) )
      .attr("y", margin.top - space/2).text("MA5")

      svg.append("rect")
      .attr("x", margin.left + space * 3)
      .attr("y", margin.top - space )
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", ma20Color)
      
      svg.append("text")
      .attr("x", margin.left + space * 3.6 )
      .attr("y", margin.top - space/2).text("MA20");

      //handing zoom on x axis only
      //leaving y axis unchanged
      const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];
      
      svg.call(d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed));

      function zoomed(event) {
        x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
        svg.selectAll(".wick g").attr("transform", d => `translate(${x(d.date)},0)`)
        .selectAll(".stick").attr("stroke-width", x.bandwidth())
        
        svg.selectAll(".wick g")
        .selectAll(".wick-line").attr("stroke-width", x.bandwidth()/10)

        svg.select(".ma5").attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) }))
        svg.select(".ma20").attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) }))
        svg.selectAll(".x-axis").call(xAxis);
      }


    }

    

    return (
      <Styles>
        <svg ref={ref} className={'chart'}></svg>
      </Styles>

    )

}

