import Header from '../../Components/Header/Header';
import './HomePage2.scss';
import data from './data.json';
import { useEffect, useState } from 'react';
import lozad from 'lozad';
import { IMDB_API } from '../../Constants/Constants';
import axios from 'axios';
import loadGif from './loader.gif';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
;
const HomePage2 = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        setMovies(data?.slice(0, 100));
        // getData();
        setTimeout(() => {
            setLoading(false);
        }, 4000);
    }, []);

    useEffect(() => {
        observer.observe();
    });

    if (loading) return (<Loader page />)

    return (
        <>
            <Header />
            <main className='mainPage'>
                <section className="moviesWrapper">
                    {movies?.map((movie, i) => (
                        <div className="movieCardSm" key={i} onClick={e => route(`/movie/${movie.id}`)}>
                            <img src={loadGif} className='lozad' data-src={movie?.image} alt={movie?.id} />
                            {/* <span>{movie?.title?.slice(0, 16)}</span> */}
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
}

export default HomePage2;