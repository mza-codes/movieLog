import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { IMDB_API } from '../../Constants/Constants';
import './ViewPage.scss';

const ViewPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState({ id: "" });
    const [fetching, setFetching] = useState(true);

    const fetchMovie = async () => {
        if (String(movie?.id) === String(id)) {
            console.warn("Movie ids matched");
            setFetching(false);
            return false;
        };
        try {
            console.log("Fetvhing movie" + id);
            const url =
                `https://imdb-api.com/en/API/Title/${IMDB_API}/${id}/FullActor,FullCast,Posters,Images,Trailer,Ratings,Wikipedia`;
            console.warn("Requesting URL", url);

            const { data } = await axios.get(url);
            console.log("Result", data);
            // localStorage.setItem('datav2', JSON.stringify(data));
            setMovie(data);
            setFetching(false);
            return;
        } catch (err) {
            console.warn("Error Fetching Title", err);
            setFetching(false);
            return;
        };
    };

    useEffect(() => {
        // let data = JSON.parse(localStorage.getItem('datav2'));
        // console.log("parsed data", data);
        // setMovie(data);
        fetchMovie();
    }, []);

    return (
        <>
            <Header />
            <main className='container-fluid'>
                <div className="viewPage row p-4">
                    {movie?.id ?
                        <>
                            <section className="info col-12 col-md-6 fw-semibold">
                                <h1 className='fw-bold'>{movie?.title || movie?.originalTitle || movie?.fullTitle}</h1>
                                <h2>{movie?.releaseDate}</h2>
                                <h3>{movie?.type}&nbsp;{movie?.year}</h3>
                                <h4>{movie?.runtimeStr}</h4>
                                <h5><iconify-icon icon="fa:imdb" />&nbsp;{movie?.imDbRating}&nbsp;
                                    <span className='votes'>({movie?.imDbRatingVotes})</span>
                                </h5>
                                <h5><iconify-icon icon="fxemoji:tomato" />&nbsp;
                                    {movie?.ratings?.rottenTomatoes}%
                                </h5>
                                <h6>{movie?.genres?.split(',')}</h6>
                                <h6 className='fs-3 fw-semibold'>{movie?.directors?.split(',')}</h6>
                                <h6>{movie?.languages?.split(',')}</h6>
                                <h6>{movie?.companies?.split(',')}</h6>

                                <div className="keyWord">
                                    <span>Related tags: </span>
                                    {movie?.keywordList?.map((value, i) => (
                                        <span key={i} className='cap'>{value}</span>
                                    ))}
                                </div>
                                <h6>Writers: {movie?.writers?.split(',')}</h6>
                                <h6>Awards: {movie?.awards}</h6>
                                <p className='plot'>{movie?.plot}</p>
                            </section>
                            <section className="image col-12 col-md-6">
                                <img src={movie?.image} alt="_movie_poster" />
                            </section>
                        </> : <h1 className='text-center py-4'>{fetching ? "Loading ... " : "404 Not Found !"}</h1>}

                </div>
            </main>
        </>
    )
}

export default ViewPage