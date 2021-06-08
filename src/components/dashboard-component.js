import React, { Fragment,  useState, useEffect } from 'react';
import axios from 'axios';
import { DASHBOARD_TOPMOVERS_URL, safeHeaders } from './api-config.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import NumberFormat from 'react-number-format';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  
  greenText: {
    color: 'green',
  },

  redText: {
    color: 'red',
  },

  yellowText: {
    color: 'orange',
  },



}));

export default function HomePageComponent() {
  const classes = useStyles();
  const [data, setData] = useState(null);  
  const [isError, setIsError] = useState(false);
    
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      

        try {
        const result = await axios.get(DASHBOARD_TOPMOVERS_URL, safeHeaders);
        setData(result.data);
        //console.log('data', result.data);
      } catch (error) {
        setIsError(true);
        console.log('error:', error);
      }

     
 
    };
 
 
 
   fetchData();
  }, []);  




    return(
    <Fragment>
      {isError && <div>Something went wrong when loading API data ...</div>}
      { data === null ? <div className={classes.root}><CircularProgress /> </div> : 
      
      (

    <Grid container spacing={1}>
      {data.map(item =>{
          
          return (

            <Grid item xs={4} sm={2} key={item.ticker}>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="body2" component="p">
                  {item.date}
                </Typography>
                <Typography variant="h5" component="h2">
                  {item.ticker}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                <NumberFormat 
                  className={item.closeChange === 0.0 ? classes.yellowText: (item.closeChange < 0 ? classes.redText: classes.greenText)} 
                  value={item.close } displayType={'text'} thousandSeparator={true} /> (  
                  
                <NumberFormat 
                  className={item.closeChange === 0.0 ? classes.yellowText: (item.closeChange < 0 ? classes.redText: classes.greenText)} 
                  value={item.closeChange * 100}               
                  decimalScale={2} displayType={'text'} suffix={'%'}/>)
                </Typography>
                <Typography variant="caption" display="block">
                
                <NumberFormat value={item.volume} displayType={'text'} thousandSeparator={true} />  
    
                </Typography>
                
                <RouterLink to={`/stockdetails/${item.ticker}`}>Detail</RouterLink>

              </CardContent>


            </Card>
            </Grid>


          )

      })}
      </Grid>
      
      )}
      
      

      </Fragment>
    )
}
