import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { originals, topRated } from '../../Constants/urls';
import HomePage from './HomePage';
import '../../App.css';

export default function Home() {

    const [movies, setMovies] = useState([])
    const [movies2, setMovies2] = useState([])

    const fetchMovies = (value, key) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(value)
                .then((response) => {
                    let results = response.data.results
                    for (let i = 0; i <= results.length; i++) {
                        if (results[i]?.original_title) {
                            console.log('Status OK')
                        } else {
                            console.log('log from change name');
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
        })
    }

    const fetchData = async () => {
        const orig = 'orig'
        const data = await fetchMovies(originals, orig)
        setMovies(data)
        const top = 'top'
        const dat = await fetchMovies(topRated, top)
        setMovies2(dat)
    }

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('orig'))
        const dat = JSON.parse(sessionStorage.getItem('top'))
        if (data !== null) {
            setMovies(data)
        }
        if (dat !== null) {
            setMovies2(dat)
        } else {
            fetchData()
        }


    }, [])

    return (
        <div className='App'>
            <HomePage list={movies ? movies : []} search={true} />
            <HomePage list={movies2 ? movies2 : []} />
        </div>
    )
}
