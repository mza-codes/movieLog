import Header from '../../Components/Header/Header';
import './HomePage2.scss';
import { useEffect, useState } from 'react';
import lozad from 'lozad';
import { IMDB_API } from '../../Constants/Constants';
import axios from 'axios';
import loadGif from './loader.gif';
import { useNavigate } from 'react-router-dom';
import data from './data';

const HomePage2 = () => {
    const [movies, setMovies] = useState([]);
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
        setMovies(data?.slice(700, 760));
        // getData();
    }, []);

    useEffect(() => {
        observer.observe();
    });

    return (
        <>
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
            </main>
        </>
    )
}

export default HomePage2;