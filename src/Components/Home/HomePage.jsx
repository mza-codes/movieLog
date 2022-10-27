import React, { useEffect } from 'react'
import { useState } from 'react';
import { POSTER_URL, w500 } from '../../Constants/Constants';
import './Home.css'
import './Home.scss'
import { useRef } from 'react';

function HomePage({ list }) {

    // console.log(list)

    let v = Math.floor(Math.random() * list.length);
    const elRef = useRef()
    const [b, setB] = useState(v)
    // const [v, setV] = useState(0)
    const [movie, setMovie] = useState()
    // let b = Math.floor(Math.random() * list.length);
    // let c = Math.floor(Math.random() * list.length);
    useEffect(() => {
        scrollHoriz()
    }, [])

    useEffect(() => {
        setMovie(list[b])
        console.log(list[b]);
    }, [b])


    const scrollHoriz = () => {
        const el = elRef.current;
        if (el) {
            const onWheel = e => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                el.scrollTo({
                    left: el.scrollLeft + e.deltaY,
                    behavior: "smooth"
                });
            };
            el.addEventListener("wheel", onWheel);
            return () => el.removeEventListener("wheel", onWheel);
        }
    }

    const handleBg = (value) => {
        if(value < 0){
            setB(0)
        }else
        if (value >= list.length - 1) {
            console.log('value >= list.length - 1 ::TRUE');
            setB(0)
        } else {
            setB(value)
        }
    }

    return (
        <div style={{ backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[b].backdrop_path : ""})` }}
            className='bg fade_bottom'  >

            {/* {search && <> <Search component={
                <> <div className="singleInput"> <select className="form-select text-dark form-select-sm"
                    onChange={(e) => setB(e.target.value)} > <option disabled>Select</option>
                    {list.map((itm, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))} </select> </div>
                </>} /> </>} */}
            <div className="singleInput">
                <select onChange={(e) => setB(e.target.value)} >
                    {/* <option disabled>0</option> */}
                    {list.map((itm, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                
            </div>
            <div className="container-fluid pt-5 text-white">
                <div className="row">
                    <div className="col-12">
                        <h2 className="misty title"> {movie ? movie.original_title : ''}</h2>
                        <p className="misty overview"> {movie ? movie.overview : ''}</p>
                    </div>
                </div>

                {/* <div className="row">
                    <div className="pt-2"><hr /></div>
                </div>
                <div className="row hRow" ref={elRef}>
                    <div className="col">
                        {list.map((itm, i) => (
                            <div key={itm.id} className="cardImg" onClick={() => setB(i)}>
                                <img src={itm ? w500 + itm.poster_path || w500 + itm.backdrop_path : ''} alt="" />
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default HomePage