import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig/firebase';
import { useContext, useEffect } from 'react';
import { AuthContex } from './Contexts/AuthContext';
import { DataContext } from './Contexts/DataContext';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const { user, setUser } = useContext(AuthContex);
  const { movieLog, setMovieLog } = useContext(DataContext);

  console.log('myLog', movieLog);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      user && fetchUserData(user);
      console.log(user);
    });

    return () => {
      unsub()
    };

  }, []);

  const fetchUserData = async (user) => {
    await getDoc(doc(db, 'webusers', user?.uid)).then((res) => {
      const value = res?.data();
      setMovieLog(value?.watchData);
      console.log('FETCHED DATA FROM FIRESTORE');
      return true;
    });
  };

  return (
    <BrowserRouter>
      {/* NAVBAR GOES HERE */}
      <Router />
    </BrowserRouter>
  );
};
