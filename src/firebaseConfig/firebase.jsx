import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "movielog-ff455.firebaseapp.com",
    projectId: "movielog-ff455",
    storageBucket: "movielog-ff455.appspot.com",
    messagingSenderId: "111855909070",
    appId: process.env.REACT_APP_FIREBASE_APPID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
