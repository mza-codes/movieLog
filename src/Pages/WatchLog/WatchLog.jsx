import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { DataContext } from '../../Contexts/DataContext';
import './WatchLog.scss';

function WatchLog() {
    const route = useNavigate();
    const { movieLog } = useContext(DataContext);
    // let movieLog = ['hf','f']

    console.log('logFF', movieLog);
    return (
        <div >
            <Header />
            <div className="container-fluid watchLog">
                <div className="row center Title">
                    <h2 className='mainHead'>My WatchLog</h2>
                    {movieLog?.length === 0 && <>
                        <p>You have'nt added anything in your movieLog! <br />Please Add Titles to View Here</p>
                        <button onClick={e => route('/addItem')} className="navigateBtn">Add Title</button> </>}
                    <p className='error'></p>

                </div>
                <div>
                    <div className="logContainer">
                        {movieLog?.map((movie) => (
                            <div className="itemBg lozad" key={movie.id} style={{ backgroundImage: `url(${movie?.url})` }}>
                                <h4 className='text'>{movie?.name}</h4>
                                <h6 className='text'>Released: {movie?.year}</h6>
                                <h5 className='text'>{movie?.watchedDate}</h5>
                                <h6 className='text'>{movie?.watchedTime}</h6>
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