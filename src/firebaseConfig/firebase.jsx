import { initializeApp } from 'firebase/app'
import { FIREBASE_API_KEY } from '../Constants/Constants';

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "movielog-ff455.firebaseapp.com",
    projectId: "movielog-ff455",
    storageBucket: "movielog-ff455.appspot.com",
    messagingSenderId: "111855909070",
    appId: "1:111855909070:web:b6f535035333bb32c8389f"
};

export const app = initializeApp(firebaseConfig)
