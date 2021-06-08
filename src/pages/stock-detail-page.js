import React, { Fragment} from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import StockDetailInfo from '../components/stock-detail-info-component';
import StockDetailTab5 from '../components/stock-detail-tab5-component';
import StockDetailTab6 from '../components/stock-detail-tab6-component';
import StockDetailChartContainer from '../components/stock-detail-chart-container';
import StockDetailDataComponent from '../components/stock-detail-data-component';
import StockDetailNotes from '../components/stock-detail-note-component';
import StockSingleChartMobile from '../components/stock-single-chart-mobile';
import StockDoubleChartMobile from '../components/stock-double-chart-mobile';



import {
  BrowserView,
  MobileView,
} from "react-device-detect";

const chartTypeCombined = "combined";
const chartTypeVolume = "volume";
const chartTypePrice = "price";



export default function StockDetailPage() {
	const params = useParams();  
 
    return (
      <Fragment>
      <BrowserView>
        <Tabs>
          <TabList>
            <Tab>Information</Tab>
            <Tab>Combined Chart</Tab>
            <Tab>Price Chart</Tab>
            <Tab>Volume Chart</Tab>  
            <Tab>Maintain Stock</Tab>
            <Tab>Maintain Notes</Tab>
          </TabList>
      
          <TabPanel>
            <StockDetailInfo ticker={params.ticker}/>
            <StockDetailDataComponent ticker={params.ticker}/>
            <StockDetailNotes ticker={params.ticker}/>


            
           </TabPanel>
          <TabPanel>
            <StockDetailChartContainer ticker={params.ticker} type={chartTypeCombined}/>
          </TabPanel>
          <TabPanel>
          <StockDetailChartContainer ticker={params.ticker} type={chartTypePrice}/>
          </TabPanel> 

          <TabPanel>
          <StockDetailChartContainer ticker={params.ticker} type={chartTypeVolume}/>
          </TabPanel> 
         
          <TabPanel>
            <StockDetailTab5 ticker={params.ticker}/>
  
          </TabPanel>
          <TabPanel>
          <StockDetailTab6 ticker={params.ticker}/>
          </TabPanel>
        </Tabs>
      
      </BrowserView>
      <MobileView>

      <Tabs>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Charts</Tab>
            <Tab>Add Stock</Tab>
            <Tab>Add Note</Tab>
          </TabList>
      
          <TabPanel>
            <StockDetailInfo ticker={params.ticker}/>
            <StockDetailDataComponent ticker={params.ticker}/>
            <StockSingleChartMobile ticker={params.ticker} type={chartTypeCombined}/>
            <StockDetailNotes ticker={params.ticker}/>
           </TabPanel>
          <TabPanel>
            
            <StockDoubleChartMobile ticker={params.ticker} />
            
          </TabPanel>
         
          <TabPanel>
            <StockDetailTab5 ticker={params.ticker}/>
  
          </TabPanel>
          <TabPanel>
          <StockDetailTab6 ticker={params.ticker}/>
          </TabPanel>
        </Tabs>
      </MobileView>
      </Fragment>
    )




} 