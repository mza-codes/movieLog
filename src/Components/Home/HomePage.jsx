import React, { useEffect } from 'react'
import { useState } from 'react';
import { POSTER_URL, w500 } from '../../Constants/Constants';
import './Home.scss';
import { useRef } from 'react';
import lozad from 'lozad';
import { ToastContainer, toast } from 'react-toastify';

function HomePage({ list }) {
    const [b, setB] = useState(4);
    const [movie, setMovie] = useState();
    const observer = lozad();

    useEffect(() => {
        observer.observe()
    });

    useEffect(() => {
        setMovie(list[b]);
    }, [b]);

    const notify = () => {
        toast("Default Notification !");
        console.log('called');
        toast.success("Success Notification !", {
            position: toast.POSITION.TOP_CENTER
        });

        toast.error("Error Notification !", {
            position: toast.POSITION.TOP_LEFT
        });

        toast.warn("Warning Notification !", {
            position: toast.POSITION.BOTTOM_LEFT
        });

        toast.info("Info Notification !", {
            position: toast.POSITION.BOTTOM_CENTER
        });

        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    };

    return (
        <div style={{ backgroundImage: `url(${list?.length !== 0 ? POSTER_URL + list[b]?.backdrop_path : ""})` }}
            className='bg fade_bottom lozad'>
            <ToastContainer />
            <div className="singleInput">
                <select onChange={(e) => setB(e.target.value)} >
                    {/* <option disabled>0</option> */}
                    {list.map((itm, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                <button onClick={notify} className='btn btn-sm btn-outline-warning m-1 p-1' >test</button>
            </div>

            <div className="container-fluid pt-5 text-white">
                <div className="row">
                    <div className="col-12">
                        <h2 className="misty title"> {movie ? movie.original_title : ''}</h2>
                        <p className="misty overview"> {movie ? movie.overview : ''}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HomePage