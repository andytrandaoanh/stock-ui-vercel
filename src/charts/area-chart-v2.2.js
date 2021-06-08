import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';


const Styles = styled.div`
.chart {
  font-size: 8px;
}

.grid line {
    stroke: lightgrey;
    stroke-opacity: 0.7;
    stroke-dasharray: 2,2;
  }
  .grid path {
    stroke-width: 0.1;
    stroke: lightgrey;
  }  

  .overlay {
    fill: none;
    pointer-events: all;
}



`


export default function BarChart(props){
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
        sum += data[i].volume;
      }


      for (let n = data.length; i < n; ++i) {
        sum += data[i].volume;
        means[i] = +d3.format("~f")(sum / N);
        sum -= data[i - N + 1].volume;
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
          
        const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.close), d3.max(data, d => d.close)])
        .rangeRound([height - margin.bottom, margin.top])
  
        const area = d3.area()
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.close))
     
        const blueColor = "#2196f3";
        const greenColor = "#8bc34a";


        //defining gradient color for the area graph
        const areaGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id","areaGradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

        areaGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#42a5f5")
        .attr("stop-opacity", 0.6);
        areaGradient.append("stop")
        .attr("offset", "30%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);



        svg.append("path")
        .datum(data)
        .attr("fill", "url(#areaGradient)")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 0)
        .attr("d", area)
     


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
        
        const yAxis = g => g
        .attr("transform", `translate(${width - margin.right}, 0)`)
        .style("font-size", "8px")
        .style("color", "dimgray")
        .call(d3.axisRight(y)
        .tickFormat(d3.format(","))
        .tickValues(d3.scaleLinear().domain(y.domain()).ticks(5)))
    
        svg.append("g")
          .call(yAxis);
        
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
           .tickFormat(""))

        const formatDate = d3.utcFormat("%-d/%-m/%Y (%a)");
        const formatValue = d3.format(",");
        
        const formatChange = (y0, y1) =>  {
            const formatPercent = d3.format("+.2%");
            return formatPercent((y1 - y0) / y0);
        }
      
           
 
        
        svg.append("path")
           .datum(data)
           .attr("fill", "none")
           .attr("stroke", blueColor)
           .attr("stroke-width", 1.5)
           .attr("d", d3.line()
             .x(function(d) { return x(d.date) })
             .y(function(d) { return y(d.close) })
             )
        
      //a vertical line to serve as crosshair
      const verticalLine = svg.append("line")
      .attr("opacity", 0)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "lightgray")
      .attr("stroke-width", 0.5)
      .attr("pointer-events", "none");
      
      
      
      //a small circle to indicate focus
      //on the line

      const focus = svg.append("g")
             .attr("class", "focus")
             .style("visibility", "hidden");
      
             focus.append("circle")
             .attr("fill", "orange")
             .attr("r", 3);
 
       const tooltip = d3.select("body")
       .append("div")
       .attr("class", "custom-tooltip")
       .style("position", "absolute")
       .style("visibility", "hidden")
       .style("background", "Cornsilk")
       .style("border", "solid 1px gray")
       .style("padding", "5px")
       .style("border-radius", "5px")
       .style("font-size", "12px")


        //custom invert function for x scale
        //reason this is needed is because
        //scaleband is used for x axis

          x.invert = (function(){
              var domain = x.domain()
              var range = x.range()
              var scale = d3.scaleQuantize().domain(range).range(domain)
          
              return function(x){
                  return scale(x)
              }
          })()
        
          //function to obtain date form x data
          const bisectDate = d3.bisector(function(d) { return d.date; }).left


          //adds an overlay rectangle to capture mouse movements
          svg.append("rect")
             .attr("class", "overlay")
             .attr("width", width)
             .attr("height", height)
             .on("mouseover", 
             function(event){ 
              
              focus.style("visibility", "visible")
              tooltip.style("visibility", "visible")
             })
             .on("mousemove", function(event){
              
                let xPos =  d3.pointer(event)[0];              
                let x0 = x.invert(xPos);
                let i = bisectDate(data, x0, 1);
                let d0 = data[i - 1];
                let d1 = data[i];
                let d = x0 - d0.date > d1.date - x0 ? d1 : d0;             

                verticalLine.attr("x1", xPos).attr("x2", xPos ).attr("opacity", 1);

                focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
                tooltip.style("top", (event.pageY + 20)+"px").style("left",(event.pageX - 20)+"px");
                tooltip.html(`
                  <span><strong>${formatDate(d.date)}</strong></span><br>                  
                  <span>Close: ${formatValue(d.close)}</span><br>
                  <span>Change: ${formatChange(d.open, d.close)}</span><br>
                  <span>Volume: ${formatValue(d.volume)}</span>`
                )
              })
             .on("mouseout", function(event){
               verticalLine.attr("opacity", 0);
               tooltip.style("visibility", "hidden");
               focus.style("visibility", "hidden");
              });

                
    }

    

    return (
      <Styles>
        <svg ref={ref} className={'chart'}></svg>
      </Styles>

    )

}

