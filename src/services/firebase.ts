import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

import * as AuthConfig from 'firebase/auth';
import  * as DatabaseConfig  from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
 
const app = initializeApp(firebaseConfig);

const auth = AuthConfig.getAuth(app)
const database = DatabaseConfig.getDatabase(app)

export { auth, database, AuthConfig, DatabaseConfig }