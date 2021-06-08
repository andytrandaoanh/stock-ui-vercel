import React, { Fragment} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { makeStyles } from '@material-ui/core/styles';
import SettingAddComponent from '../components/setting-add-component';
import SettingEditComponent from '../components/setting-edit-component';
import PlungeAddComponent from '../components/plunge-add-component';
import PlungeEditComponent from '../components/plunge-edit-component';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
  
  }));


  

export default function SystemSettingPage() {
    const classes = useStyles();
  
      return (
  
          <Fragment>
           
            <Tabs>
              <TabList>
              
                <Tab>Add Key</Tab>
                <Tab>Edit Keys</Tab>
                <Tab>Add Plunge</Tab>
                <Tab>Edit Plunges</Tab>
              </TabList>
          
              <TabPanel>
              
                <SettingAddComponent />
              
              </TabPanel>
              <TabPanel>
                <SettingEditComponent />
              </TabPanel>
              <TabPanel>
                <PlungeAddComponent />
              </TabPanel>              
              <TabPanel>
                <PlungeEditComponent />
              </TabPanel>                  
            </Tabs>
          
 
          </Fragment>
  
      )
  
  }