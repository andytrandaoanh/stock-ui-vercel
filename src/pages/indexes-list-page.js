import React, { Fragment} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {BrowserView, MobileView,} from "react-device-detect";
import IndexValueTable from '../components/index-value-list-component';
import IndexVolumeTable from '../components/index-volume-list-component';
import IndexDataComponent from '../components/index-data-component';
import IndexDataMobileComponent from '../components/index-data-mobile-component';
import IndexValueChartMobile from '../components/index-value-chart-mobile';
import IndexValueChartComponent from '../components/index-value-chart-component';
import IndexVolumeChartMobile from '../components/index-volume-chart-mobile';
import IndexVolumeChartComponent from '../components/index-volume-chart-component';
import IndexCombinedChartMobile from '../components/index-combined-chart-mobile';
import IndexCombinedChartComponent from '../components/index-combined-chart-component';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },

}));



export default function ListContainer() {
  const classes = useStyles();

    return (

        <Fragment>
         <BrowserView>
          <Tabs>
            <TabList>
            
              <Tab>Value</Tab>
              <Tab>Volume</Tab>
              <Tab>Value Chart</Tab>
              <Tab>Volume Chart</Tab>
              <Tab>Combined Chart</Tab>
              <Tab>Daily Key Index</Tab>
              <Tab>Daily Sub Index</Tab>

            </TabList>
        
            <TabPanel>
                <IndexValueTable />
            </TabPanel>
            <TabPanel>
                <IndexVolumeTable />
            </TabPanel>
            <TabPanel>
             <IndexValueChartComponent />
            </TabPanel>
            <TabPanel>
              <IndexVolumeChartComponent/>
            </TabPanel>   
            <TabPanel>
             <IndexCombinedChartComponent />

            </TabPanel>  
            <TabPanel>
            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={12} md={6}>
                <IndexDataComponent ticker = {'VNINDEX'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <IndexDataComponent ticker = {'HNX-INDEX'} />
              </Grid>
            </Grid>
            </TabPanel>  
            <TabPanel>
            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={12} md={6}>
                <IndexDataComponent ticker = {'VN30INDEX'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <IndexDataComponent ticker = {'UPCOM-INDEX'} />
              </Grid>
            </Grid>
            </TabPanel>              
            </Tabs>
          </BrowserView>
          <MobileView>
          <Tabs>
            <TabList>
              <Tab>Data</Tab>          
              <Tab>Combined</Tab>             
              <Tab>Value</Tab>          
              <Tab>Volume</Tab>        
            </TabList>
        
            <TabPanel>
              <IndexDataMobileComponent  />
     
            </TabPanel>
            <TabPanel>
              <IndexCombinedChartMobile  />
     
            </TabPanel>
            
            <TabPanel>
              <IndexValueChartMobile  />
     
            </TabPanel>
            <TabPanel>
              <IndexVolumeChartMobile  />
     
            </TabPanel>



            </Tabs>
          </MobileView>
        </Fragment>

    )

}