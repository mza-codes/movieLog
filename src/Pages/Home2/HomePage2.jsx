import Header from '../../Components/Header/Header';
import './HomePage2.scss';
import data from './data.json';
import { useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import lozad from 'lozad';
import { IMDB_API } from '../../Constants/Constants';
import axios from 'axios';
import image from './img.jpg';

const moviesAtom = atom([]);

const HomePage2 = () => {
    // const [movies, setMovies] = useAtom(moviesAtom);
    const [movies, setMovies] = useState([]);
    console.log("MOVIES ATOM UPDATED", movies);
    const observer = lozad();
    const values = ["MostPopularTVs", "BoxOfficeAllTime", "Top250TVs", "Top250Movies", "MostPopularMovies"];

    const fetchData = async (value) => {
        console.log(`Fetching ${value} ..`);
        try {
            const { data } = await axios.get(`https://imdb-api.com/en/API/${value}/${IMDB_API}`);
            // setMovies(data?.items);
            setMovies((curr) => ([...data?.items, ...curr]));
            return true;
        } catch (error) {
            console.log("error fetching data on homepage2");
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
        console.log("logging local pasted", data);
        setMovies(data);
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
                    {movies?.map((movie, i) => (
                        <div className="movieCardSm" key={(i + (i * i) - i) / 2}>
                            <img src={image} className='lozad' data-src={movie?.image} alt={movie?.id} />
                            {/* <span>{movie?.title?.slice(0, 16)}</span> */}
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
}

export default HomePage2;