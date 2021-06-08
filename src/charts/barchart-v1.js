// BarChart.js
import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Styles = styled.div`
.bar {
    fill: steelblue;
  }
`



export default function BarChart({ width, height, data }){
    const ref = useRef();
    

    useEffect(() => {
        draw();
    }, [data]);

    const draw = () => {
       
        const margin = 100;
        console.log(width);
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black")
        let chartWidth = width -margin;
        let chartHeight = height - margin;
;
        let xScale = d3.scaleBand().range ([0, chartWidth]).padding(0.4);
        let yScale = d3.scaleLinear().range ([chartHeight, 0]);

        let xOffset = 50;
        let yOffset = 30;
        let g = svg.append("g")
               .attr("transform", `translate(${xOffset},${yOffset})`);
               xScale.domain(data.map(function(d) { return d.year; }));
               yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
       
               g.append("g")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(d3.axisBottom(xScale));
       
               g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d){
                    return "$" + d;
                }).ticks(10))
                .append("text")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("value");

                g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return xScale(d.year); })
                .attr("y", function(d) { return yScale(d.value); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return chartHeight - yScale(d.value); });        
    }


    return (
        <Styles>
        <svg ref={ref}></svg>
        </Styles>



        
    )

}

