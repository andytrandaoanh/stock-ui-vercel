import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import IndexTransAddComponent from '../components/index-trans-add-component';
import IndexTransEditComponent from '../components/index-trans-edit-component';
import IndexFileListComponent from '../components/index-file-list-component';
import IndexFileUploadComponent from '../components/index-upload-component';

export default function AddIndexDataPage () {

	return (


        <Tabs>
          <TabList>
            <Tab>Add Index Data</Tab>
            <Tab>Edit Index Data</Tab>
			<Tab>Upload Data</Tab>
			<Tab>Data File List</Tab>

          </TabList>
      
          <TabPanel>
            <IndexTransAddComponent />
          </TabPanel>
          
          <TabPanel>
            <IndexTransEditComponent />
          </TabPanel>
          <TabPanel>
            <IndexFileUploadComponent />
          </TabPanel>

          <TabPanel>
            <IndexFileListComponent />
          </TabPanel>

        </Tabs>

    )
}
