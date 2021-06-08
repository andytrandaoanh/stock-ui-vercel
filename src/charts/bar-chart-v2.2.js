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

`


export default function BarChart(props){
    const ref = useRef();
    

    useEffect(() => {

      if (props.data[0])  draw(props.data);
         

    }, [props.data]);

    
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
        .domain([d3.min(data, d => d.volume), d3.max(data, d => d.volume)])
        .rangeRound([height - margin.bottom, margin.top])
  
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
  
  
        //svg.append("g")
        //.call(xAxis)
        
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
           
        const formatDate = d3.utcFormat("%-d/%-m/%Y (%a)");
        const formatVolume = d3.format(",");
        const formatValue = d3.format(".2f");
        const formatChange = (y0, y1) =>  {
        const formatPercent = d3.format("+.2%");
          return formatPercent((y1 - y0) / y0);
        }
               
        

        const bars = svg.append("g")

        bars.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .style("fill", "steelblue")
          .attr("x", function(d) { return x(d.date); })
          .attr("y", function(d) { return y(d.volume); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - margin.top - margin.bottom - y(d.volume); })
         
         /*
          .on("mouseover", 
          function(event, d){ 
            return (
              tooltip.style("visibility", "visible")
              .html(`
                <span><strong>${formatDate(d.date)}</strong></span><br>
                <span>Volume: ${formatVolume(d.volume)}</span><br>
                <span>Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})</span><br>

    
              `)
            )           
          })
          .on("mousemove", function(event){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
          */
    


  
    }

    

    return (
      <Styles>
        <svg ref={ref} className={'chart'}></svg>
      </Styles>

    )

}

