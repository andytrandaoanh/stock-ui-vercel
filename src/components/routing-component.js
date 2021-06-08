import {  Switch,  Route } from "react-router-dom";
import HomePage from '../pages/home-page';
import FileUploadPage from '../pages/file-upload-page';
import ListContainerPage from '../pages/list-container-page';
import IndexListPage from '../pages/indexes-list-page';
import AddIndexDataPage from '../pages/add-index-data-page';
import StockDetailPage from '../pages/stock-detail-page';
import SystemSettingPage from '../pages/system-setting-page';


export default function RoutingComponent()  {
    
    return (
      <Switch>
        
        <Route path="/addindexdata" component={AddIndexDataPage} />        
        <Route path="/indexes/list" component={IndexListPage} />    
        <Route path="/lists/:id" component={ListContainerPage} />
        <Route path="/settings" component={SystemSettingPage} />
        <Route path="/stockdetails/:ticker" component={StockDetailPage} />               
        <Route path="/upload" component={FileUploadPage} />
        <Route path="/" component={HomePage} />
        
      </Switch>

      
    );
    
}
