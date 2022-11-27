import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { IMDB_API } from '../../Constants/Constants';
import './ViewPage.scss';

const ViewPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState({ id: "" });

    const fetchMovie = async () => {
        if (String(movie?.id) === String(id)) { console.warn("Movie ids matched"); return false; }
        try {
            console.log("Fetvhing movie" + id);
            const url =
                `https://imdb-api.com/en/API/Title/${IMDB_API}/${id}/FullActor,FullCast,Posters,Images,Trailer,Ratings,Wikipedia`;
            console.warn("Requesting URL", url);

            const { data } = await axios.get(url);
            console.log("Result", data);
            // localStorage.setItem('datav2', JSON.stringify(data));
            setMovie(data);
            return;
        } catch (err) {
            console.warn("Error Fetching Title", err);
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
                <div className="viewPage row pt-4">
                    <section className="info col-12 col-md-6">
                        <h1>{movie?.title || movie?.originalTitle || movie?.fullTitle}</h1>
                        <h2>{movie?.type}&nbsp;{movie?.year}</h2>
                        <h3>{movie?.releaseDate}</h3>
                        <h4>{movie?.runtimeStr}</h4>
                        <h5><iconify-icon icon="fa:imdb" />&nbsp;{movie?.imDbRating}&nbsp;
                            <span className='votes'>({movie?.imDbRatingVotes})</span>
                        </h5>
                        <h6>{movie?.genres?.split(',')}</h6>
                        <h6>{movie?.directors?.split(',')}</h6>
                        <h6>{movie?.languages?.split(',')}</h6>
                        <h6>{movie?.companies?.split(',')}</h6>
                        <h6><iconify-icon icon="fxemoji:tomato" />&nbsp;{movie?.ratings?.rottenTomatoes}%</h6>
                        <div className="keyWord">
                            <span>Related tags: </span>
                            {movie?.keywordList?.map((value, i) => (
                                <span key={i} className='truncate'>{value}</span>
                            ))}
                        </div>
                        <h6>{movie?.writers?.split(',')}</h6>
                        <h6>{movie?.awards}</h6>
                        <p className='plot'>{movie?.plot}</p>
                    </section>
                    <section className="image col-12 col-md-6">
                        <img src={movie?.image} alt="_movie_poster" />
                    </section>
                </div>
            </main>
        </>
    )
}

export default ViewPage