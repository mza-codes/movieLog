import { API_KEY, RAPID_IMDB_API, TMDB_URL } from "./Constants"

export const topRated = `${TMDB_URL}/movie/top_rated?api_key=${API_KEY}&with_genres=10751&page=1`
export const upcoming = `${TMDB_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
export const trending2 = `${TMDB_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`
export const action2 = `${TMDB_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`
export const originals = `${TMDB_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`

export const query = {
    method: 'GET',
    url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
    params: { q: 'avengers' },
    headers: {
        'X-RapidAPI-Key': RAPID_IMDB_API,
        'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
    }
};

// --------------- IMDB REQUEST -------------------
// const options = {
//     method: 'GET',
//     url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
//     params: { q: props.data },
//     headers: {
//         'X-RapidAPI-Key': IMDB_API_KEY, //key disabled as it is sending request in a loop fix issue/use another method
//         'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
//     }
// }
// axios.request(options).then(function (response) {
//     console.log('LOGG from MoviePost', response.data);
//     console.log(response.data)
//     setResult(response.data)
//     setSearch(true)
//     // setItem = response.data
// }).catch(function (error) {
//     console.log(error);
// });
// // ---------------- IMDB REQUEST END------------------

// {<div key={data.id} className='poster-card'>
//     <div className="dark-fade-top"></div>
//     <img key={data.id} onClick={() => { trailerHandler(data.id); handleStore(data); }}
//         className={props.small ? 'poster-small poster-card'
//             : 'poster poster-card'} src={defImage} alt={data.title}
//         srcSet={`${data.image.url ? data.image.url : defImage}`} />
//     <div className="dark-fade-bottom"></div>
// </div>}