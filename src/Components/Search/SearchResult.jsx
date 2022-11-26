import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_KEY, POSTER_URL, TMDB_URL, w500 } from '../../Constants/Constants';
import { Box, Button, Rating, Tooltip, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import './search.scss';
import styled from '@emotion/styled';
import flags from './flags';
import Header from '../Header/Header';
import lozad from 'lozad';
import axios from 'axios';
import './SearchResult.scss';
import Iconify from '../../Hooks/Iconify';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});
// logo TMDB Iconify 'cib:the-movie-database'
function SearchResult() {
    const params = useParams();
    const observer = lozad();
    const query = params.query;
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [list, setList] = useState([]);
    const [movie, setMovie] = useState();
    let v = Math.floor(Math.random() * flags.length);

    const fetchResult = async () => {
        try {
            const res = await axios.get(`${TMDB_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query || 'shadow'}`);
            console.log('FETCHED QUERY', res);
            setList(res.data.results);
            if (res.data.results.length <= 0) { setNotFound(true); setLoading(false); return false; }
            setNotFound(false);
            setLoading(false);
            return true;
        } catch (e) {
            console.log(e);
            document.getElementById('noResult').innerHTML = e?.message || e?.code || "Server Error";
            setNotFound(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        observer.observe()
    });

    useEffect(() => {
        fetchResult();
    }, [query]);

    const downloadPoster = (url, name) => {
        console.log(url);
        if (window.confirm('This Image Will be Downloaded ! Confirm ?')) {
            const image = new Image();
            image.onload = () => {
                const { naturalWidth: w, naturalHeight: h } = image;
                let stat = w === Number && h === Number ? true : false;
                return stat;
            }
            image.onerror = () => { return false; }
            image.src = url;

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
                }
                xhr.send();
            } else {
                console.log('null link');
                return false;
            }
        }
    }

    return (
        <>
            <Header />
            <div className="container-fluid resBg">
                <div className='result'>
                    <div className="row">
                        <h4 className="lemosty">Search Results for "{query}"</h4>
                    </div>
                    {/* Not Found */}
                    {notFound && <div className="row center">
                        <p id='noResult'>No Results found for your query "{query}"</p>
                    </div>}
                    {/* Loader */}
                    {loading && <div className="loader">
                        <div className="loadbar"></div>
                        <button className="button">
                            <span className="actual-text">&nbsp;Loading&nbsp;Results</span>
                            <span className="hover-text" aria-hidden="true">&nbsp;Loading&nbsp;Results</span>
                        </button>
                    </div>}
                    {/* Horizontal Scrollable Row */}
                    {/* <div className="resultRow py-5" >
                        <div className="poster">
                            {list?.map((itm, i) => (
                                <div key={itm.id} >
                                    <img onClick={() => setMovie(itm)} alt="movie_poster" className='lozad'
                                        src={itm ? w500 + itm.poster_path || w500 + itm.backdrop_path : ''} />
                                </div>
                            ))}
                        </div>
                    </div> */}
                    <div className="resv2">
                        {list?.map((data, i) => (
                            <div key={data.id} className='resItem'>
                                <img key={data.id} alt={data.title} className='resultPoster lozad' onClick={() => setMovie(data)}
                                    src={data ? w500 + data?.poster_path || w500 + data?.backdrop_path : ''}
                                //  onClick={() => fechTitle(data.id)}
                                />
                                <div className="infoContainer">
                                    {/* <span className="misty">{data?.title}</span> */}
                                    <Tooltip title={data?.original_title}>
                                        <a href={`https://imdb.com${data.id}`} target='_blank' rel='noreferrer'>
                                            <Iconify icon='cib:the-movie-database' color='#000000' borderRadius={1}
                                                height={20} width={20} />&nbsp;{data?.original_title?.substring(0, 30) ||
                                                    data?.title?.substring(0, 30)}</a>
                                    </Tooltip>
                                    <span >
                                        <Iconify icon={data?.video ? 'icon-park-outline:movie' : 'mdi:movie-open-play-outline'}
                                            width={20} height={20} color='black' /> &nbsp;{data?.release_date} </span>
                                    {data?.poster_path && <div>
                                        <button onClick={() => downloadPoster(POSTER_URL + data?.poster_path ||
                                            POSTER_URL + data?.backdrop_path, data?.title?.slice(0, 25))}>
                                            <Iconify icon='fa6-solid:download' width={20} height={20} /> </button>
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {movie && <div className="row movie" >
                    <div className="col-12 col-md-6 poster">
                        <img className='lozad' alt="movie_poster"
                            data-src={movie ? w500 + movie?.poster_path || w500 + movie?.backdrop_path : ''} />
                    </div>
                    <div className="col-12 col-md-6 content">
                        <h3 className="misty">{movie?.title ||
                            (movie?.original_title?.length > 20 ? movie?.original_title?.slice(0, 20) : movie?.original_title)}</h3>
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
                        >{movie && movie?.original_language ? <> <i className={`fi fi-${flags[v]}`} />
                            &nbsp; {movie?.original_language?.toUpperCase()}</> : ''}</h5>

                    </div>
                </div>}
            </div>
        </>
    )
}

export default SearchResult