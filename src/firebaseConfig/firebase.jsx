import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { FIREBASE_API_KEY } from '../Constants/Constants';

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "movielog-ff455.firebaseapp.com",
    projectId: "movielog-ff455",
    storageBucket: "movielog-ff455.appspot.com",
    messagingSenderId: "111855909070",
    appId: process.env.REACT_APP_FIREBASE_APPID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
