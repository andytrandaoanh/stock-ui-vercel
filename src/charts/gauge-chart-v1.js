import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';


const Styles = styled.div`
.chart {
    font-family:  Helvetica, Arial, sans-serif;
    margin: 32px;
}


.arc {
    fill: steelblue;
}

.pointer {
    fill: #e85116;
    stroke: #b64011;
}

.label text {
    text-anchor: middle;
    font-size: 14px;
    font-weight: bold;
    fill: #666;
}

`


export default function GaugeChart(props){
    const ref = useRef();

    //constants
   
    const minAngle = -90;
	const maxAngle	= 90;    
    const minValue = 0;
    const majorTicks = 5;
    const ringWidth = 20;
    const ringInset = 20;
    const labelInset = 10;	
    const pointerWidth = 10;
    const pointerTailLength	= 5;
    const pointerHeadLengthPercent = 0.9;



    const labelFormat = d3.format(".1f");
    const arcColorFn = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))

    //global values
    let r = undefined;
    let tickData = undefined;
    let arc = undefined;
    let range = undefined;
    let pointerHeadLength = undefined;
    let scale = undefined;
    let ticks = undefined;
    let newAngle = undefined;

    useEffect(() => {

      draw();
         

    }, []);
    


    
    function deg2rad(deg) {
		return deg * Math.PI / 180;
    }
    

    function configure() {
        const { size, value,  maxValue } = props;
		range = maxAngle - minAngle;
		r = size / 2;
		pointerHeadLength = Math.round(r * pointerHeadLengthPercent);

		// a linear scale that maps domain values to a percent from 0..1
		scale = d3.scaleLinear()
			.range([0,1])
            .domain([minValue, maxValue]);
            
        var ratio = scale(value);
        newAngle = minAngle + (ratio * range);    
			
		ticks = scale.ticks(majorTicks);
		tickData = d3.range(majorTicks).map(function() {return 1/majorTicks;});
		
		arc = d3.arc()
			.innerRadius(r - ringWidth - ringInset)
			.outerRadius(r - ringInset)
			.startAngle(function(d, i) {
				var ratio = d * i;
				return deg2rad(minAngle + (ratio * range));
			})
			.endAngle(function(d, i) {
				var ratio = d * (i+1);
				return deg2rad(minAngle + (ratio * range));
            });


    }
    



    function centerTranslation() {
		return 'translate('+ r +',' + r + ')';
    }
    
  
    const draw = () => {
      
        const {clipWidth, clipHeight} = props;
        configure();  


        //set the view port for chart
        const svg = d3.select(ref.current)
        .attr("viewBox", [0, 0, clipWidth, clipHeight]);

        const centerTx = centerTranslation();
  
  		//draw the gauge facelet
		const arcs = svg.append('g')
				.attr('class', 'arc')
				.attr('transform', centerTx);


        arcs.selectAll('path')
			.data(tickData)
			.enter().append('path')
			.attr('fill', function(d, i) {
					return arcColorFn(d * i);
			})
            .attr('d', arc);
        
            
        //draw number captions 
        const lg = svg.append('g')
            .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', function(d) {
                var ratio = scale(d);
                var newAngle = minAngle + (ratio * range);
                return 'rotate(' + newAngle +') translate(0,' +( labelInset - r) +')';
            })
            .text(labelFormat);

        const lineData = [[pointerWidth / 2, 0], 
        [0, - pointerHeadLength],
        [-(pointerWidth / 2), 0],
        [0, pointerTailLength],
        [pointerWidth / 2, 0] ];    
        
        const pointerLine = d3.line().curve(d3.curveMonotoneX);
        const pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
                .attr('transform', centerTx);
        const pointer = pg.append('path')
            .attr('d', pointerLine )
            .attr('transform', 'rotate(' + newAngle +')');


    }

    

    return (
      <Styles>
        <svg ref={ref} className={'chart'}></svg>
      </Styles>

    )

}

