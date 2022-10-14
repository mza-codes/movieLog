import { API_KEY, TMDB_URL } from "./Constants"

export const topRated = `${TMDB_URL}/movie/top_rated?api_key=${API_KEY}&with_genres=10751&page=1`
export const upcoming =  `${TMDB_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
export const trending2 = `${TMDB_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`
export const action2 = `${TMDB_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`
export const originals =  `${TMDB_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`