import {  BrowserRouter as Router } from "react-router-dom";
import TopAppBar from './components/app-bar-component';
import Routing from './components/routing-component.js';
//import './App.css';

//console.log('base url', process.env.REACT_APP_BASE_URL);
//console.log('api key', process.env.REACT_APP_API_KEY);

export default function App () {
  return (
      <div>
        <Router>
          <TopAppBar />
          <Routing />
        </Router>
      </div>
   )
}
