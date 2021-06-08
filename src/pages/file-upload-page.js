import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import FileUpload from '../components/file-upload-component';
import FileList from '../components/file-list-component';
import MaintainData from '../components/add-stock-data-component';
import TransEditComponent from '../components/transaction-edit-component';


export default function FileUploadPage () {

	return (
	
	
	
		<Tabs>
		<TabList>
		  <Tab>Upload File</Tab>
		  <Tab>Process File</Tab>
		  <Tab>Add Data</Tab>
		  <Tab>Edit Data</Tab>
		</TabList>
	
		<TabPanel>
			<FileUpload />
		</TabPanel>
		<TabPanel>
			<FileList />
		</TabPanel>
		<TabPanel>
			<MaintainData />
		</TabPanel>
		<TabPanel>
			<TransEditComponent />
		</TabPanel>


		</Tabs>
		
		
		
		)
}
