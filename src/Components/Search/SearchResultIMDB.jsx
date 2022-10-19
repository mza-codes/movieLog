import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { POSTER_URL, RAPID_IMDB_API, w500 } from '../../Constants/Constants'
import { Box, Button, Rating, Tooltip, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import './search.scss'
import styled from '@emotion/styled'
import flags from './flags'
import axios from 'axios'

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

function SearchResultIMDB() {
    const params = useParams()
    const query = params.query
    const [list, setList] = useState([])
    const [result, setResult] = useState([])
    const [movie, setMovie] = useState()
    let v = Math.floor(Math.random() * flags.length)
    useEffect(() => {
        const temp = ['orig', 'top']
        let c = Math.floor(Math.random() * temp.length)
        const dat = JSON.parse(sessionStorage.getItem(temp[c]))
        setList(dat)

    }, [])

    const fetchResult = async () => {
        console.log('fetchResult called');
        const data = {
            method: 'GET',
            url: 'https://online-movie-database.p.rapidapi.com/title/v2/find',
            params: { title: query, limit: '50' },
            headers: {
                'X-RapidAPI-Key': RAPID_IMDB_API, //key disabled as it is sending request in a loop fix issue/use another method
                'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
            }
        }
        await axios.request(data).then((response) => {
            console.log('Rapid API Response Fetched', response.data)
            setResult(response.data.results)
            sessionStorage.setItem('resv2',JSON.stringify(response.data.results))
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        // fetchResult()
        let data = JSON.parse(sessionStorage.getItem('resv2'))
        data ? setResult(data) : fetchResult()
        console.log(data);
    }, [])

    return (
        <>
            <div className="container-fluid">
                <div className="row text-center py-2">
                <h4 className="lemosty">Search Results for "{query}"</h4>
                </div>
                    <div className="row">
                        {result && result.length !==0 && result.map((data, i) => (
                            <div key={data.id} className='col'>
                                <img key={data.id} alt={data.title} className='resultPoster'
                                    // src={`${data.image.url ? data.image.url : ''}`}
                                    src={data?.image?.url} 
                                    />
                                    <p className="misty">{data.id}</p>
                            </div>
                        ))}
                    </div>
                
            </div>
        </>
    )

    // return (
    //     <>
    //         <div className="container-fluid">
    //             <div className='result'>
    //                 <div className="row">
    //                     <h4 className="lemosty">Search Results for "{query}"</h4>
    //                 </div>
    //                 <div className="resultRow py-5" >
    //                     <div className="poster">
    //                         {list.map((itm, i) => (
    //                             <div key={itm.id} >
    //                                 <img onClick={() => setMovie(itm)} alt="movie_poster"
    //                                     src={itm ? w500 + itm.poster_path || w500 + itm.backdrop_path : ''} />
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             </div>
    //             {movie && <div className="row movie" >
    //                 <div className="col-12 col-md-6 poster">
    //                     <img src={movie ? w500 + movie?.poster_path || w500 + movie?.backdrop_path : ''} alt="movie_poster" />
    //                 </div>
    //                 <div className="col-12 col-md-6 content">
    //                     {console.log(movie)}
    //                     <h3 className="misty">{movie?.original_title}</h3>
    //                     <h5 className="misty">{movie?.title}</h5>
    //                     <h4 className="misty">{movie?.overview}</h4>
    //                     {/* <h5 className="misty">Rating:</h5> */}
    //                     <div className="rating">
    //                         <StyledRating
    //                             // name="customized-color"
    //                             // defaultValue={2}
    //                             // getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
    //                             // precision={0.5}
    //                             value={movie?.vote_average / 2} readOnly
    //                             precision={0.2}
    //                             icon={<FavoriteIcon fontSize="inherit" />}
    //                             emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
    //                         />
    //                         <Tooltip title={`${movie?.vote_average} / 10`}>
    //                             <h6 className='voteCount'>&nbsp; <ThumbUpIcon fontSize="inherit" />
    //                                 &nbsp;{movie?.vote_count} </h6></Tooltip>
    //                     </div>
    //                     <h5 className="misty">{movie?.release_date}</h5>
    //                     {/* <h6 className="misty">{movie?.popularity}</h6> */}
    //                     <h5 aria-label='the flags are generated using math.random' className=""
    //                     >{movie && movie.original_language ? <> <i className={`fi fi-${flags[v]}`} />
    //                         &nbsp; {movie.original_language.toUpperCase()}</> : ''}</h5>

    //                 </div>
    //             </div>}
    //         </div>
    //     </>
    // )
}

export default SearchResultIMDB