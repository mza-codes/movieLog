import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { action2, originals, topRated, trending2 } from '../../Constants/urls';
import HomePage from './HomePage';
import '../../App.css';
import Header from '../Header/Header';

export default function Home() {

    const [movies, setMovies] = useState([]);
    const [movies2, setMovies2] = useState([]);

    const fetchMovies = (value, key) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(value)
                .then((response) => {
                    let results = response.data.results
                    for (let i = 0; i <= results.length; i++) {
                        if (!results[i]?.original_title) {
                            // console.log('Status OK')
                            // } else {
                            if (results[i]?.name) {
                                results[i].original_title = results[i].name
                            } else if (results[i]?.original_name) {
                                results[i].original_title = results[i].original_name
                            }
                        }
                    }
                    sessionStorage.setItem(key, JSON.stringify(results))
                    // setMovies(results)
                    console.log('Fetched by URL');
                    resolve(results)
                })
                .catch(err => { console.log('Home.jsx ERROR OCCURED', err); reject(err) })
        });
    };

    const fetchData = async () => {
        const orig = 'orig'
        const data = await fetchMovies(action2, orig)
        setMovies(data)
        const top = 'top'
        const dat = await fetchMovies(trending2, top)
        setMovies2(dat)
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='App'>
            <Header />
            <HomePage list={movies ? movies : []} />
            {/* <HomePage list={movies2 ? movies2 : []} /> */}
        </div>
    )
}
