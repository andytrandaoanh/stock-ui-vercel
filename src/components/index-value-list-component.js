import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { INDEX_LIST_URL , safeHeaders} from './api-config.js';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CgArrowLeft } from 'react-icons/cg';
import { CgArrowLongDown} from 'react-icons/cg';
import { CgArrowLongUp } from 'react-icons/cg';



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  
}));


const styles = {

  high: {
    background: '#76ff03',

  },


  mediumHigh: {
    background: '#00e676',

    
  },

  medium: {
    background: '#ffee33',

    
  },

  mediumLow: {
    background: '#ffac33',

    
  },

   
  low: {
    background: '#ff784e',
 
    
  },


}; 



const StyledTableCell = (props) =>{
  //console.log('row', props.row, 'column', props.column);
  let thisValue = props.value;
  let lastValue = null;
  let percentage = 0;
  if (props.column > 1) {
    let lastValueKey = props.colData[props.column - 1].accessor;
    //console.log('last value key', lastValueKey);
    let lastRow = props.rowData[props.row];
    //console.log('last row', lastRow);
    lastValue = lastRow[lastValueKey];
    if(lastValue) percentage = (thisValue - lastValue) * 100 / lastValue;
  }


  //console.log('this value', thisValue, 'last value', lastValue);
  
  //console.log('percentage', percentage);
  let cellStyle = styles.medium;
  let cellSymbol = <CgArrowLeft />;

  if (percentage === 0) {
    cellStyle = styles.medium;
  } 
  else if (percentage > 1.0) {
    cellStyle = styles.high;
    cellSymbol = <CgArrowLongUp />;
  }
  else if (percentage <= 1.0 && percentage > 0.0) {
    cellStyle = styles.mediumHigh;
    cellSymbol =  <CgArrowLongUp />;   
  }
  else if (percentage < 0.0 && percentage > - 1.0){
    cellStyle = styles.mediumLow;
    cellSymbol = <CgArrowLongDown />;   
  }

  else {
    cellStyle = styles.low;
    cellSymbol = <CgArrowLongDown />;   
  }

  if (props.type === 'ticker') 
  return  <td style={styles.ticker}>{props.value}</td>
  else

      return (

        <td style={cellStyle}>

      <span>{cellSymbol}</span>
          
          <NumberFormat 
          value={props.value} 
          displayType={'text'} 
          thousandSeparator={true} 
          decimalScale = {2}
          prefix={''} />
          </td>
      )  

}


const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    font-size: 11px;

    caption {
      font-size: 20px;
      font-weight: bold;
    }

    tr {
      :nth-child(even){background-color: #f2f2f2;}  
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid gray;
      border-right: 1px solid gray;
      td: text-align: left;
      

      :last-child {
        border-right: 0;
      }
    }
    td + td {text-align: right;}
    th {color: gray;}

  }

  ul { list-style: none; font-size: 12px; }
  li { float: left; margin-right: 10px; }
  li span { border: 1px solid #ccc; float: left; width: 12px; height: 12px; margin: 2px; }
`

function IndexValueTable(props) {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState([]);
  const [volumeColumns, setVolumeColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  


  const generateHeader = () => 
        <tr key="index-value-list-headers">
            {volumeColumns.map((item)=>
                <th key={item.Header}>{item.Header}</th>
            )}
        </tr>


  const generateRows = () => 

    <tbody>
        {volumeData.map((row, rowIndex)=>
          <tr key={`${row.ticker}-value`}>
            {volumeColumns.map((col, colIndex)=>
              <StyledTableCell 
              key = {row.ticker + colIndex}
              value={row[col.accessor]} 
              type={col.accessor} 
              row={rowIndex} 
              column={colIndex}
              rowData = {volumeData}
              colData = {volumeColumns}
              />
            )}
          </tr>
        )


        }

    </tbody>

  


  
  
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

        try {
        const result = await axios.get(`${INDEX_LIST_URL}/value`, safeHeaders);
        //console.log('api url', `${INDEX_LIST_URL}/value`);
        setVolumeData(result.data.data);
        setVolumeColumns(result.data.columns);
        //console.log('data.data:', result.data.data);
      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      
 
    };
 


    fetchData();
    
  }, []);  


  return (

<Fragment>
 
  {isError && <div>Something went wrong when loading API data ...</div>}
    {isLoading ? ( <div className={classes.root}><CircularProgress />    
    </div>) : (
     <Styles>
        <table>
            <caption>VALUE LIST</caption>

        <thead>
            {generateHeader()}
        </thead>
        
            {generateRows()}
        
        </table> 
         <ul>
          <li key="high-rise"><span style={styles.high}></span>High Rise</li>
          <li key="medium-rise"><span style={styles.mediumHigh}></span>Medium Rise</li>
          <li key="unchanged"><span style={styles.medium}></span>Unchanged</li>
          <li key="medium-drop"><span style={styles.mediumLow}></span> Medium Drop</li>
          <li key="steep-drop"><span style={styles.low}></span> Steep Drop</li>
          </ul>
              
    </Styles>
    )}
    </Fragment>
  )
}

export default IndexValueTable;
