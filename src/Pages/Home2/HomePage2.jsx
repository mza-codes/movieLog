import Header from '../../Components/Header/Header';
import './HomePage2.scss';
import { useContext, useEffect, useState } from 'react';
import lozad from 'lozad';
import { IMDB_API } from '../../Constants/Constants';
import axios from 'axios';
import loadGif from './loader.gif';
import { useNavigate } from 'react-router-dom';
import data from './data';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthContex } from '../../Contexts/AuthContext';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const HomePage2 = () => {
    const [movies, setMovies] = useState([]);
    const { setUser } = useContext(AuthContex);
    const route = useNavigate();
    const observer = lozad();
    const values = ["MostPopularTVs", "BoxOfficeAllTime", "Top250TVs", "Top250Movies", "MostPopularMovies"];

    const fetchData = async (value) => {
        console.log(`Fetching ${value} ..`);
        try {
            const { data } = await axios.get(`https://imdb-api.com/en/API/${value}/${IMDB_API}`);
            setMovies((curr) => ([...data?.items, ...curr]));
            return true;
        } catch (error) {
            console.warn("error fetching data on homepage2");
            return false;
        };
    };

    const getData = () => {
        values.forEach((item) => {
            fetchData(item);
        });
        return true;
    };

    const getMore = () => {
        console.log("Getmore data on homescreen");
        setMovies((curr) => ([...data?.slice(725, 800), ...curr]));
        return true;
    };

    const emailLinkLogin = async () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            };
            signInWithEmailLink(auth, email, window.location.href)
                .then(async (result) => {
                    window.localStorage.removeItem('emailForSignIn');
                    console.log(result);
                    console.log('FETCHED USER', result.user);
                    setUser(result.user);
                    const snap = await getDoc(doc(db, 'webusers', result.user.uid))
                    if (snap.exists()) {
                        console.log('DATA EXISTS');
                        // route('/');
                        return true;
                    } else {
                        setDoc(doc(db, "webusers", result.user.uid), {
                            userName: "",
                            email: result?.user?.email,
                            emailVerified: result?.user?.emailVerified,
                            joinDate: result?.user?.metadata?.creationTime,
                            joinedTime: result?.user?.metadata?.createdAt,
                            ownerId: result?.user?.uid,
                            watchData: []
                        });
                        console.log('ADDED DATA');
                        // route('/');
                        return true;
                    };
                }).catch((error) => {
                    console.log("Error occured in Signinwith email link",error);
                    return;
                });
        }else{
            console.log("Normal");
            return true;
        };
    };

    useEffect(() => {
        emailLinkLogin();
        setMovies(data?.slice(700, 724));
        // getData();
    }, []);

    useEffect(() => {
        observer.observe();
    });

    return (
        <>
            <ToastContainer />
            <Header />
            <main className='mainPage'>
                <section className="moviesWrapper">
                    {/* {data?.length >= 1 && data?.map((movie, i) => ( */}
                    {movies?.map((movie, i) => (
                        <div className="movieCardSm" key={i} onClick={e => route(`/movie/${movie.id}`)}>
                            <img src={loadGif} className='lozad' data-src={movie?.image} alt={movie?.id} />
                            {/* <span>{movie?.title?.slice(0, 16)}</span> */}
                        </div>
                    ))}
                </section>
                <div className="button">
                    <button className='fw-bold' onClick={getMore}>MORE</button>
                </div>
            </main>
        </>
    )
}

export default HomePage2;