import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './search.scss'

function Search({ component }) {
    const [query, setQuery] = useState('');
    const [imdb, setImdb] = useState(false);
    const route = useNavigate();

    const handleSearch = () => {
        if (imdb) {
            console.log('imdb true');
            route(`/searchv2/${query}`);
            return;
        };
        route(`/search/${query}`);
        return;
    };

    return (
        <>
            <div className="search">
                <input type="text" onChange={(e) => setQuery(e.target.value)}
                    placeholder='Enter Something to Search for...' />
                <div className='searchBottom'>
                    <div className="selector">
                        <label htmlFor="val" >Use IMDB</label>
                        <input onChange={(e) => { setImdb(e.target.checked) }} type="checkbox" name="val" id="val" />
                    </div>
                    {/* <button hidden={query === ''} onClick={handleSearch} className='btn btn-sm btn-outline-warning'>Search</button> */}
                    {/* <button hidden={query === ''} onClick={handleSearch} className='searchBtn'>Search</button> */}
                    <button hidden={query === ''} onClick={handleSearch} >Search </button>
                </div>
                <div className="select">
                    {component && component}
                </div>
            </div>
        </>
    )
}

export default Search