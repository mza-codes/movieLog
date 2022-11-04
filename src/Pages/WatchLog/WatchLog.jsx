import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { DataContext } from '../../Contexts/DataContext';
import { Button, Popover, Badge, Tooltip, IconButton } from '@mui/material';
import './WatchLog.scss';
import Iconify from '../../Hooks/Iconify';
import * as _ from 'lodash';
import EditItem from '../EditItem/EditItem';

function WatchLog() {
    const route = useNavigate();
    const { movieLog } = useContext(DataContext);
    const [editData, setEditData] = useState({});
    const [edit, setEdit] = useState(false);
    // let movieLog = []; // dev testing
    const [watchLog, setWatchLog] = useState([]);
    const [view, setView] = useState(true);
    const [openSort, setOpenSort] = useState(null);
    const [label, setLabel] = useState('');
    const [urlSearch, setUrlSearch] = useState(false);
    const alpha = /^[A-Za-z ]+$/;
    const regExNumbers = /^[0-9 ]+$/;
    const setData = useCallback(() => {
        console.log('INSIDE USECALLBACK');
        setWatchLog(movieLog);
    }, []);


    useEffect(() => {

        setData();
        if (movieLog.length <= 0) {
            setView(false);
        };
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
        setWatchLog(_.sortBy(watchLog, value).reverse());
        return;
    };

    const handleSearch = (query) => {
        let result = []
        console.log('searchValue', query);
        const isWord = alpha.test(query);
        const isNumber = regExNumbers.test(query);
        console.log(isWord, isNumber);
        if (isWord) {
            result = movieLog.filter((data) => {
                return data.name.toLowerCase().includes(query.toLowerCase()) ||
                    (urlSearch && data.url.toLowerCase().includes(query.toLowerCase()))
            });
            setWatchLog(result);
            return;

        } else if (isNumber) {
            result = movieLog.filter((data) => {
                return data.year <= query || data.watchedTime.includes(query);
            });
            setWatchLog(result);
            return;

        } else {
            result = movieLog.filter((data) => {
                return data.watchedDate.includes(query) || data.watchedTime.includes(query) ||
                    data.id.includes(query) || data.createdAt.includes(query)
            });
            setWatchLog(result);
            return;
        };
    };

    const editTitle = (movie) => {
        console.log('called');
    };

    return (
        <div >
            <Header />
            <div className="container-fluid watchLog">
                <div className="row center Title">
                    <h2 className='mainHead'>My WatchLog</h2>
                    {!view && <>
                        <p>You have'nt added anything in your movieLog! <br />Please Add Titles to View Here</p>
                        <button onClick={e => route('/addItem')} className="navigateBtn">Add Title</button>
                    </>}
                    <p className='error'></p>
                </div>
                {view && <div className="sortWrapper">
                    <div className="searcher">
                        <input type="text" onChange={e => handleSearch(e.target.value)} placeholder='Search From Titles...' />
                        <Tooltip title="Include Searching in Image URLs"><div className='urlBox'>
                            <input type="checkbox" onChange={e => setUrlSearch(!urlSearch)} />
                            <span>URL</span>
                        </div></Tooltip>
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
                                        handleSort(e, option.value, option.state)
                                    }} >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </Popover>
                </div>}
                <div>
                    <div className="logContainer">
                        {watchLog.length === 0 && <h1 className='notFoundErr'>Title Not Found! </h1>}
                        {watchLog?.map((movie, i) => (
                            <div className="itemBg lozad" key={movie.id} style={{ backgroundImage: `url(${movie?.url})` }}>
                                <div className="editBtn">
                                    <IconButton sx={{ color: "inherit" }} onClick={e => route(`/editItem/${movie?.id}`)} 
                                    // onClick={e => route(`/editItem/${movie?.id}`)} onClick={e => editTitle(movie)}
                                    >
                                        <Iconify icon="bxs:message-rounded-edit" />
                                    </IconButton>
                                </div>
                                <div className='text'>
                                    <h4>{movie?.name}</h4>
                                    <h6>Released: {movie?.year}</h6>
                                    <h5>{movie?.watchedDate}</h5>
                                    <h6>{movie?.watchedTime}</h6>
                                    {!movie?.watchCount === 1 && <Badge badgeContent={movie?.watchCount} color="success" />}
                                </div>
                                <div className="addBtn">
                                    <IconButton sx={{ color: "inherit" }}>
                                        <Iconify icon="fluent:add-square-multiple-20-filled" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default WatchLog;