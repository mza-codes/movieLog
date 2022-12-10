import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { HashRouter } from 'react-router-dom'
import Router from './router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig/firebase';
import { useContext, useEffect } from 'react';
import { AuthContex } from './Contexts/AuthContext';
import { DataContext } from './Contexts/DataContext';
import { doc, getDoc } from 'firebase/firestore';
import useDataStore from './Store/useDataStore';

if (process.env.NODE_ENV === 'production') {
  console.log = () => { return true; }
  console.error = () => { return true; }
  console.debug = () => { return true; }
};

export default function App() {
  const { setUser } = useContext(AuthContex);
  const { setMovieLog } = useContext(DataContext);
  const populate = useDataStore(state => state.populate);

  const fetchUserData = async (user) => {
    await getDoc(doc(db, 'webusers', user?.uid)).then((res) => {
      const value = res?.data();
      setMovieLog(value?.watchData || []);
      console.log('FETCHED DATA FROM FIRESTORE');
      return true;
    }).catch(err => console.warn("Error Fetching Userdata", err));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // user && fetchUserData(user);
      user && populate(user);
      console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <HashRouter hashType="hashbang">
      {/* NAVBAR GOES HERE */}
      <Router />
    </HashRouter>
  );
};
