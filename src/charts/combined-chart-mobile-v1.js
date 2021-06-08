import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';


const Styles = styled.div`
.chart {
  font-size: 8px;
}

.grid line {
    stroke: lightgrey;
    stroke-opacity: 0.8;
    stroke-width: 0.4;
  }
  .grid path {
    stroke-width: 0;
    stroke: lightgrey;
  }  

  .overlay {
    fill: none;
    pointer-events: all;
}



`


export default function CombinedChart(props){
    const ref = useRef();
    

    useEffect(() => {

      if (props.data[0])  draw(props.data);
         

    }, [props.data]);
  
  
    const draw = (data) => {
        const margin = {top: 20, right: 60, bottom: 20, left: 20};
        
        const {width, height} = props;

        const chart1Height = 200;
        const chartGap = 5;

        const chart1 = {
            height: chart1Height, 
            width: width - margin.left - margin.right,
            top: margin.top,
            bottom: chart1Height + margin.top,
            left: margin.left,
            right: width - margin.right,
            xScale: null,
            yScale: null
        }

        const chart2 = {
            height: height - margin.top - margin.bottom - chart1.height - chartGap,
            width: width - margin.left - margin.right,
            top: margin.top + chart1.height + chartGap,
            bottom: height - margin.bottom,
            left: margin.left,
            right: width - margin.right,
            xScale: null,
            yScale: null 

        }
          
        //set the view port for chart
        const svg = d3.select(ref.current)
        .attr("viewBox", [0, 0, width, height]);
  
        chart1.xScale = d3.scaleBand()
        .domain(d3.utcDay
        .range(data[0].date, +data[data.length - 1].date + 1)
        .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([chart1.left, chart1.right])
        .padding(0.2)
          
        chart1.yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.close), d3.max(data, d => d.close)])
        .rangeRound([chart1.bottom, chart1.top])
  
        const area = d3.area()
        .x(d => chart1.xScale(d.date))
        .y0(chart1.yScale(0))
        .y1(d => chart1.yScale(d.close))
     
        const blueColor = "#2196f3";
        const purpleColor = "#d500f9";
        const orangeColor = "#ff9800";

        

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
        .attr("transform", `translate(0,${chart1.bottom})`)
        .style("font-size", "8px")
        .style("color", "dimgray")
        .call(d3.axisBottom(chart1.xScale)
        .tickValues(d3.utcMonday
        .every(width > 720 ? 1 : 2)
        .range(data[0].date, data[data.length - 1].date))
        .tickFormat(d3.utcFormat("%-d/%-m")))
        .call(g => g.select(".domain").remove())
  
        //disable x-axis of chart 1 to use that of chart 2
        
        //svg.append("g").call(xAxis)
        
        const yAxis = g => g
        .attr("transform", `translate(${chart1.right}, 0)`)
        .style("font-size", "8px")
        .style("color", "dimgray")
        .call(d3.axisRight(chart1.yScale)
        .tickFormat(d3.format(","))
        .tickValues(d3.scaleLinear().domain(chart1.yScale.domain()).ticks(5)))
    
        svg.append("g")
          .call(yAxis);
        
        // gridlines in y axis function
        function makeHorizontalGridlines() {		
            return d3.axisLeft(chart1.yScale)
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
         
        //drawing the main line 

        svg.append("path")
           .datum(data)
           .attr("fill", "none")
           .attr("stroke", orangeColor)
           .attr("stroke-width", 1.8)
           .attr("d", d3.line()
             .x(function(d) { return chart1.xScale(d.date) })
             .y(function(d) { return chart1.yScale(d.close) })
             )
        


        //a vertical line to serve as crosshair
        const verticalLine = svg.append("line")
        .attr("opacity", 0)
        .attr("y1", 0)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "orange")
        .attr("stroke-width", 1.0)
        .attr("pointer-events", "none");
      


        //a small circle to indicate point of focus
        const focus = svg.append("g")
        .attr("class", "focus")
        .style("visibility", "hidden")
        .append("circle")
        .attr("fill", "orange")
        .attr("r", 3);
 
        //prepare a tooltip which is attached to outer page
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

        //define a custom function for getting invert value of x scale
        //reason this is needed is because
        //scaleband is used for x axis

        chart1.xScale.invert = (function(){
            var domain = chart1.xScale.domain()
            var range = chart1.xScale.range()
            var scale = d3.scaleQuantize().domain(range).range(domain)
        
            return function(x){
                return scale(x)
            }
        })()
      
        //function to obtain date value form x position
        const bisectDate = d3.bisector(function(d) { return d.date; }).left;


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
           let x0 = chart1.xScale.invert(xPos);
           let i = bisectDate(data, x0, 1);
           let d0 = data[i - 1];
           let d1 = data[i];
           let d = x0 - d0.date > d1.date - x0 ? d1 : d0;             

           verticalLine.attr("x1", xPos).attr("x2", xPos ).attr("opacity", 1);

           focus.attr("transform", "translate(" + chart1.xScale(d.date) + "," + chart1.yScale(d.close) + ")");
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

           
         //CHART NO 2

         chart2.xScale = d3.scaleBand()
         .domain(d3.utcDay
         .range(data[0].date, +data[data.length - 1].date + 1)
         .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
         .range([chart2.left, chart2.right])
         .padding(0.2)
           
         chart2.yScale = d3.scaleLinear()
         .domain([d3.min(data, d => d.volume), d3.max(data, d => d.volume)])
         .rangeRound([chart2.bottom, chart2.top])

         chart2.xAxis = g => g
         .attr("class", "x-axis")
         .attr("transform", `translate(0,${chart2.bottom})`)
         .style("font-size", "8px")
         .style("color", "dimgray")
         .call(d3.axisBottom(chart2.xScale)
         .tickValues(d3.utcMonday
         .every(width > 720 ? 1 : 2)
         .range(data[0].date, data[data.length - 1].date))
         .tickFormat(d3.utcFormat("%-d/%-m")))
         .call(g => g.select(".domain").remove())
  
         chart2.yAxis = g => g
         .attr("transform", `translate(${chart2.right}, 0)`)
         .style("font-size", "8px")
         .style("color", "dimgray")
         .call(d3.axisRight(chart2.yScale)
         .tickFormat(d3.format(","))
         .tickValues(d3.scaleLinear().domain(chart2.yScale.domain()).ticks(4)))

         svg.append("g")
         .call(chart2.yAxis);

         svg.append("g")
         .call(chart2.xAxis);

        chart2.makeHorizontalGridlines = () => {		
            return d3.axisLeft(chart2.yScale)
                .ticks(5)
        }

        // add the Y gridlines

        
        svg.append("g")			
        .attr("class", "grid")
        .call(chart2.makeHorizontalGridlines()
            .tickSize(-width)
            .tickFormat(""))


        
        const bars = svg.append("g");
        bars.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .attr("x", function(d) { 
            return chart2.xScale(d.date); })
        .attr("y", function(d) {  return chart2.yScale(d.volume); })
        .attr("width", chart2.xScale.bandwidth())
        .attr("height", function(d) { return height - chart2.yScale(d.volume)  - margin.bottom; })
        

        //draw a horizoantal line to beautify the bottom x-axix
        const horizontalLine = svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", height - margin.bottom)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "lightgray")
        .attr("stroke-width", 1.0)
        
    }

    

    return (
      <Styles>
        <svg ref={ref} className={'chart'}></svg>
      </Styles>

    )

}

