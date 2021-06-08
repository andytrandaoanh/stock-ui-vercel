import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { INDEX_LIST_URL, safeHeaders } from './api-config.js';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

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

    th {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid gray;
      border-right: 1px solid gray;
      td: text-align: left;

      :last-child {
        border-right: 0;
      }
    }
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

function IndexVolumeTable(props) {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState([]);
  const [volumeColumns, setVolumeColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //const [listData, setListData] = useState(['VNINDEX', 'HNX-INDEX']);
  //const [isListLoading, setIsListLoading] = useState(false);
  //const [isListError, setIsListError] = useState(false);
    
  
  const highVolume = 5000000;
  const fairVolume = 3000000;
  const mediumVolume = 1000000;
  //const lowVolume = 500000;
  
  const styles = {
    ticker: {
      padding: '0.5rem',
    },

    high: {
      background: '#b9f6ca',

    },

    fair: {
      background: '#b3e5fc',
  
      
    },
    
    medium: {
      background: '#e6ee9c',

      
    },
     
    low: {
      background: '#ffcc80',
   
      
    },

    legendContainer: {
      width: '100%',
      height: 40,
      marginTop: 10,
    },
    legendSwatch: {
      width: 80,
      height: 20,
      margin: 5,
      background: 'gray',
      float: 'left',

    },
    
  }; 



  const StyledTableCell = (props) => {
    let cellStyle = styles.high;
    if (props.value > highVolume) cellStyle = styles.high;
    else if (props.value <= highVolume && props.value > fairVolume) 
      cellStyle = styles.fair;
    else if (props.value <= fairVolume && props.value > mediumVolume)
      cellStyle = styles.medium;
    else  cellStyle = styles.low;


      if (props.type === 'ticker') {
       
        return <td style={styles.ticker}>{props.value}</td>

        
 
      }
      
      else {
      
        return (
          <td style={cellStyle}>
          <NumberFormat 
          value={props.value}  
          displayType={'text'} 
          thousandSeparator={true} 
          prefix={''} /></td>
        )

      }
 

  } 

  const generateHeader = () => 
        <tr key="index-volume-list-headers">
            {volumeColumns.map((item)=>
                <th key={item.Header}>{item.Header}</th>
            )}
        </tr>


  const generateRows = () => 

    <tbody>
        {volumeData.map((row)=>
          <tr key={row.ticker}>
            {volumeColumns.map((item, index)=>


              <StyledTableCell key={row.ticker + index} value={row[item.accessor]} type={item.accessor}/>
                
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
        const result = await axios.get(`${INDEX_LIST_URL}/volume`, safeHeaders);
        setVolumeData(result.data.data);
        setVolumeColumns(result.data.columns);
        //console.log('data.data:', result.data.columns);
      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

      setIsLoading(false);
      
 
    };
 
    fetchData();
  }, [props.listId]);  


  return (

<Fragment>
    
    {isError && <div>Something went wrong when loading API data ...</div>}
    {isLoading ? ( <div className={classes.root}><CircularProgress />    
    </div>) : (
    <Styles>
        <table>
            <caption>VOLUME LIST</caption>

        <thead>
            {generateHeader()}
        </thead>
        
            {generateRows()}
        
        </table> 
        <ul className="legend">
          <li key="high-volume"><span style={styles.high}></span>High Volume</li>
          <li key="fair-volume"><span style={styles.fair}></span> Fair Volume</li>
          <li key="medium-volume"><span style={styles.medium}></span> Medium Volume</li>
          <li key="low-volume"><span style={styles.low}></span> Low Volume</li>
          </ul>
              
    </Styles>
    
    )}
    
    </Fragment>
  )
}

export default IndexVolumeTable
