import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IMDB_API, RAPID_IMDB_API, w500 } from '../../Constants/Constants'
import { Rating, Tooltip } from '@mui/material'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import './search.scss'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import styled from '@emotion/styled'
import flags from './flags'
import axios from 'axios'
import Header from '../Header/Header'
import lozad from 'lozad';
import Iconify from '../../Hooks/Iconify';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

function SearchResultIMDB() {
    const { query } = useParams();
    const observer = lozad();
    const [result, setResult] = useState([]);
    const [movie, setMovie] = useState();
    let v = Math.floor(Math.random() * flags.length);
    const fetchResult = async () => {
        console.log('fetchResult called');
        const data = {
            method: 'GET',
            url: 'https://online-movie-database.p.rapidapi.com/title/v2/find',
            params: { title: query, limit: '50' },
            headers: {
                'X-RapidAPI-Key': 'kkk',
                'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
            }
        };
        await axios.request(data).then((response) => {
            console.log('Rapid API Response Fetched', response.data);
            setResult(response.data.results);
            return;
        }).catch((error) => {
            console.log(error);
            return;
        });
    };

    const fetchTitles = async () => {
        try {
            const url = `https://imdb-api.com/en/API/SearchMovie/${IMDB_API}/${query}`;
            const response = await axios.get(url);
            console.log("fetchEd Data", response);
            setResult(response?.data?.results);
            return;
        } catch (err) {
            console.log("Error Fetching titles from imdb-api", err);
            return;
        };
    };

    useEffect(() => {
        observer.observe();
    });

    useEffect(() => {
        // Fetching using rapid-imdb-api
        // fetchResult();
        // Fetch using imdp-api
        fetchTitles();
    }, [query]);

    const fechTitle = async (value) => {
        console.log(value);
        const q = value.split('/')
        let query = q[2]
        if (query.includes('tt')) {
            const url =
                `https://imdb-api.com/en/API/Title/${IMDB_API}/${query}/FullActor,FullCast,Posters,Images,Trailer,Ratings,Wikipedia`
            console.log(url);
            await axios.get(url).then((res) => {
                console.log(res);
            })
        } else {
            console.log('not ok no id found');
            return;
        };
    };

    const downloadPoster = (url, name) => {
        if (window.confirm('This Image Will be Downloaded ! Confirm ?')) {
            if (url?.includes('https://', '.jpg', '.png', 'http://')) {
                console.log('includes link');
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "blob";
                xhr.onload = function () {
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL(this.response);
                    var tag = document.createElement('a');
                    tag.href = imageUrl;
                    tag.download = name + '.jpg';
                    document.body.appendChild(tag);
                    tag.click();
                    document.body.removeChild(tag);
                };
                xhr.send();
            } else {
                console.log('null link');
                return false;
            };
        };
    };

    useEffect(() => {
        const element = document.getElementById('title');
        if (!result.length) {
            element.innerText = "Loading..";
        };
        setTimeout(() => {
            if (result.length <= 0) {
                element.innerText = `No Titles found for "${query}"`;
                return;
            } else {
                element.innerText = `Search Results for "${query}"`;
                return;
            };
        }, 6000);
    });

    return (
        <>
            <Header />
            <div className="container-fluid resBgIMDB">
                <div className="row text-center py-2">
                    <h4 id='title' className="lemosty py-2">Search Results for "{query}"</h4>
                </div>
                {movie && <div className="row movie" >
                    <div className="col-12 col-md-6 poster">
                        <img src={movie ? w500 + movie?.poster_path || w500 + movie?.backdrop_path : ''} alt="movie_poster" />
                    </div>
                    <div className="col-12 col-md-6 content">
                        {console.log(movie)}
                        <h3 className="misty">{movie?.original_title}</h3>
                        <h5 className="misty">{movie?.title}</h5>
                        <h4 className="misty">{movie?.overview}</h4>
                        {/* <h5 className="misty">Rating:</h5> */}
                        <div className="rating">
                            <StyledRating
                                // name="customized-color"
                                // defaultValue={2}
                                // getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                // precision={0.5}
                                value={movie?.vote_average / 2} readOnly
                                precision={0.2}
                                icon={<FavoriteIcon fontSize="inherit" />}
                                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                            />
                            <Tooltip title={`${movie?.vote_average} / 10`}>
                                <h6 className='voteCount'>&nbsp; <ThumbUpIcon fontSize="inherit" />
                                    &nbsp;{movie?.vote_count} </h6></Tooltip>
                        </div>
                        <h5 className="misty">{movie?.release_date}</h5>
                        {/* <h6 className="misty">{movie?.popularity}</h6> */}
                        <h5 aria-label='the flags are generated using math.random' className=""
                        >{movie && movie.original_language ? <> <i className={`fi fi-${flags[v]}`} />
                            &nbsp; {movie.original_language.toUpperCase()}</> : ''}</h5>

                    </div>
                </div>}
                <div className="resv2">
                    {result && result.length !== 0 && result.map((data, i) => (
                        <div key={data.id} className='resItem'>
                            <img key={data.id} alt={data.title} className='resultPoster lozad'
                                // src={`${data.image.url ? data.image.url : ''}`}
                                data-src={data?.image?.url || data?.image} onClick={() => fechTitle(data.id)}
                            />
                            <div className="infoContainer">
                                {/* <span className="misty">{data?.title}</span> */}
                                <Tooltip title={data?.title}>
                                    <a href={`https://imdb.com${data.id}`} target='_blank' rel='noreferrer'>
                                        <Iconify icon='fontisto:imdb' color='#DBA506' borderRadius={1}
                                            height={20} width={20} />&nbsp;{data?.title?.substring(0, 30)}</a>
                                </Tooltip>
                                <span >
                                    <Iconify icon={(data?.titleType?.toLowerCase() || data?.resultType.toLowerCase()) === 'movie'
                                        ? 'icon-park-outline:movie' : 'mdi:movie-open-play-outline'}
                                        width={20} height={20} color='black' /> &nbsp;{data?.year} </span>
                                {(data?.image?.url || data?.image) && <div>
                                    <button onClick={() => downloadPoster(data?.image?.url, data?.title?.slice(0, 25))}>
                                        <Iconify icon='fa6-solid:download' width={20} height={20} /> </button>
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default SearchResultIMDB