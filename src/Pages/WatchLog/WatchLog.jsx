import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { DataContext } from '../../Contexts/DataContext';
import { Menu, Button, MenuItem, Typography, Popover, Avatar, Badge } from '@mui/material';
import './WatchLog.scss';
import Iconify from '../../Hooks/Iconify';
import * as _ from 'lodash';

function WatchLog() {
    const route = useNavigate();
    const { movieLog } = useContext(DataContext);
    const [watchLog, setWatchLog] = useState([]);
    const [view, setView] = useState(true);
    const [openSort, setOpenSort] = useState(null);
    const [label, setLabel] = useState('');

    useEffect(() => {
        console.log('logFF', movieLog);
        setWatchLog(movieLog);
        if (movieLog.length <= 0) {
            setView(false);
        }
    }, []);

    const SORT_BY_OPTIONS = [
        { value: 'name', state: '-', label: 'Featured' },
        { value: 'id', state: 'date', label: 'Recently' },
        { value: 'watchCount', state: 'priceHigh', label: 'Most Watched' },
        { value: 'createdAt', state: 'priceHigh', label: 'Created At' },
        { value: 'year', state: 'priceHigh', label: 'Release' },
        { value: 'watchedDate', state: 'priceHigh', label: 'Yearly' },

    ];
    const handleSort = (e, value, action) => {
        e.preventDefault();
        console.log(value);
        let data = _.sortBy(watchLog, value).reverse();
        setWatchLog(data);
    };

    const handleSort2 = (e, value, action) => {
        e.preventDefault();
        console.log(value);
        setWatchLog(_.sortBy(watchLog, value).reverse());
    };

    return (
        <div >
            <Header />
            <div className="container-fluid watchLog">
                <div className="row center Title">
                    <h2 className='mainHead'>My WatchLog</h2>
                    {watchLog?.length === 0 && <>
                        <p>You have'nt added anything in your movieLog! <br />Please Add Titles to View Here</p>
                        <button onClick={e => route('/addItem')} className="navigateBtn">Add Title</button> </>}
                    <p className='error'></p>

                </div>
                {view && <div className="sortWrapper">
                    <div className="searcher">
                        <input type="text" placeholder='Search From Titles...' />
                        <button>Search</button>
                    </div>
                    <Button
                        color="inherit"
                        disableRipple
                        onClick={e => setOpenSort(e.currentTarget)}
                        endIcon={<Iconify icon={openSort ? 'bi:sort-up-alt' : 'bi:sort-down'} />}
                    // startIcon={<Iconify icon='bxs:sort-alt' />}
                    >Sort By:&nbsp;<b>{label}</b>
                    </Button>
                    <Popover
                        anchorEl={openSort}
                        open={Boolean(openSort)}
                        onClose={e => setOpenSort(null)}
                        // onClick={() => { setReload(false) }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    > <div className="sortOption">
                            {SORT_BY_OPTIONS.map((option) => (
                                <button className='selectBtn' key={option.label} value={option.value}
                                    onClick={(e) => {
                                        setLabel(option.label); setOpenSort(null);
                                        handleSort2(e, option.value, option.state)
                                    }} >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </Popover>
                </div>}
                <div>
                    <div className="logContainer">

                        {watchLog?.map((movie) => (
                            <div className="itemBg lozad" key={movie.id} style={{ backgroundImage: `url(${movie?.url})` }}>
                                <div className='text'>
                                    <h4>{movie?.name}</h4>
                                    <h6>Released: {movie?.year}</h6>
                                    <h5>{movie?.watchedDate}</h5>
                                    <h6>{movie?.watchedTime}</h6>
                                    {!movie?.watchCount === 1 && <Badge badgeContent={movie?.watchCount} color="success" />}
                                </div>
                                {/* <p>Added On: {movie?.createdAt}</p> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default WatchLog;