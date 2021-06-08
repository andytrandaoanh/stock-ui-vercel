import React, { Fragment} from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    BrowserView,
    MobileView,
  } from "react-device-detect";
  
import VolumeListTable from '../components/volume-list-component';
import PriceListTable from '../components/price-list-component';
import StockListTable from '../components/stock-list-component';
import ListItemMobile from '../components/list-item-mobile-component';
import StockListDisplay from '../components/stock-list-display-component';


export default function ListContainer() {
  const params = useParams();   
    return (

        <Fragment>
         <BrowserView>
          <Tabs>
            <TabList>
              <Tab>Price</Tab>
              <Tab>Volume</Tab>
              <Tab>Maintain Lists</Tab>
              <Tab>Maintain Items</Tab>
            </TabList>
        
            <TabPanel>
                <PriceListTable id = {params.id}/>
            </TabPanel>
            <TabPanel>
                <VolumeListTable id = {params.id}/>
            </TabPanel>
            <TabPanel>
                <StockListTable/>
            </TabPanel>
            <TabPanel>
                <StockListDisplay listId = {params.id}/>
            </TabPanel>            
            </Tabs>
          </BrowserView>
          <MobileView>
          <Tabs>
            <TabList>
              <Tab>Items</Tab>
              <Tab>Maintain Lists</Tab>
              <Tab>Maintain Items</Tab>
            </TabList>
        
            <TabPanel>
                <ListItemMobile id = {params.id}/>
            </TabPanel>
            <TabPanel>
                <StockListTable/>
            </TabPanel>
            <TabPanel>
                <StockListDisplay listId = {params.id}/>
            </TabPanel>              
            </Tabs>
          </MobileView>
        </Fragment>

    )

}