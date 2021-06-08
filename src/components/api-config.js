

import {FIREBASE_BASE_URL, FIREBASE_API_KEY} from '../firebase-config';
const BASE_URL = FIREBASE_BASE_URL;
const API_KEY = FIREBASE_API_KEY;



/*
const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
*/


export const safeHeaders = {headers: {
    'x-api-key': `${API_KEY}`
  }};

export const safeHeadersMultiPart = {headers: {
    'Content-Type': 'multipart/form-data', 
    'x-api-key': `${API_KEY}`
  }};

  

export const FILE_UPLOAD_URL = `${BASE_URL}/upload`;    

export const FILE_PROCESS_URL = `${BASE_URL}/process`;  

export const DATA_FILE_URL = `${BASE_URL}/datafiles`;    

export const PRICE_LIST_URL = `${BASE_URL}/transactions/pricelist`;

export const VOLUME_LIST_URL = `${BASE_URL}/transactions/volumelist`;

export const STOCK_LIST_URL = `${BASE_URL}/stocklists`;

export const STOCK_DETAIL_URL = `${BASE_URL}/stockdetails`;

export const STOCK_NOTES_URL = `${BASE_URL}/stocknotes`;

export const STOCK_LIST_ITEM_URL = `${BASE_URL}/stocklistitems`;

export const TRANSACTIONS_TICKER_URL = `${BASE_URL}/transactions/search`;

export const MAX_TRANS_DATES_URL = `${BASE_URL}/maxtransdates`;

export const INDEX_UPLOAD_URL = `${BASE_URL}/indexupload`;

export const MAX_INDEX_TRANS_URL = `${BASE_URL}/indextransmax`;

export const INDEX_DATA_FILE_URL = `${BASE_URL}/indexfiles`;

export const INDEX_FILE_PROCESS_URL = `${BASE_URL}/indexfileprocess`;

export const INDEX_LIST_URL = `${BASE_URL}/indexes`;

export const TRANSACTIONS_URL = `${BASE_URL}/transactions`;

export const INDEX_TRANSACTIONS_URL = `${BASE_URL}/indexes`;

export const WEB_SCRAPERS_URL = `${BASE_URL}/webscrapers`;

export const DASHBOARD_TOPMOVERS_URL = `${BASE_URL}/dashboard/topmovers`;

export const SYSTEM_SETTINGS_URL = `${BASE_URL}/sysconfigs`;

export const STOCK_PLUNGE_URL = `${BASE_URL}/plunges`;