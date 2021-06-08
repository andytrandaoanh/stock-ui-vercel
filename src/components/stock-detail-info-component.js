import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import styled from 'styled-components';
import axios from 'axios';
import { STOCK_DETAIL_URL,  safeHeaders } from './api-config';
import CircularProgress from '@material-ui/core/CircularProgress';



const Styles = styled.div`
.container {
  padding: 10px;
  width: 100%;
}


/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}


.row-title {
  font-weight: bold;
  display: inline-block;
  width: 100px;
  text-align: left;
}

.row-data {
  text-align: left;
}



`
export default function StockDetailTab1Component(props) {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

 
  

  useEffect(() => {
    

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

        try {
        const result = await axios.get(`${STOCK_DETAIL_URL}/search?ticker=${props.ticker}`,safeHeaders);
        //console.log(result.data);
        setData(result.data[0]);
       

      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
     
 
    };

 
    fetchData();
  }, [props.ticker]);  




    return (

      <Styles>
      {isError && <div>Error encountered loading API data ...</div>}
      {isLoading && <div><CircularProgress /></div>}    
      {data &&
        
          <div className="row">

            <div className="container">
            <p><span className="row-title">Symbol</span><span className="row-data">{data.ticker.toUpperCase()}</span></p>
            <p><span className="row-title">Company</span><span className="row-data">{data.company}</span></p>
            <p><span className="row-title">Exchange</span><span className="row-data">{data.exchange}</span></p>
            <p><span className="row-title">Industry</span><span className="row-data">{data.industry}</span></p>
            


          </div>
          </div>

          
        
      }




    </Styles>        
      );



} 