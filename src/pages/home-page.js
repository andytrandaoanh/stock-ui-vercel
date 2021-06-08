import DashBoardComponent from '../components/dashboard-component';
import DashBoardActivePrint from '../components/dashboard-active-print';
import GaugeChartContainer from '../components/gauge-chart-container';
import PlungeDataComponent from '../components/plunge-data-component';
import NoteDisplayComponent from '../components/note-display-component';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


export default function HomePage () {

	return (

		<Tabs>
		<TabList>
		  <Tab>Most Active</Tab>
		  <Tab>Warning</Tab>
		  <Tab>History</Tab>
		  <Tab>Print Active</Tab>
		  <Tab>Notes</Tab>
		</TabList>
	
		<TabPanel>
			<DashBoardComponent />
		</TabPanel>
		<TabPanel>
			<GaugeChartContainer />
		</TabPanel>
		<TabPanel>
			<PlungeDataComponent />
		</TabPanel>
		<TabPanel>
			<DashBoardActivePrint />
		</TabPanel>
		<TabPanel>
			<NoteDisplayComponent />
		</TabPanel>
		</Tabs>

	)



}
