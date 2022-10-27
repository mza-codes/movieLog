import Header from '../Header/Header'
import lozad from 'lozad'
import { useEffect, useState } from 'react'
import { POSTER_URL } from '../../Constants/Constants';
import './style.scss'

export const Login = () => {
    const [bg, setBg] = useState('');
    const [list,setList] = useState([]);
    let v = Math.floor(Math.random() * list.length);
    let data = sessionStorage.getItem('top');
    const fetchBg = () => {
        if (!data) {
            // case
        } else {
            let value = JSON.parse(data)
            
            setList(value)
            let image = value[v].backdrop_path;
            setBg(image);
            console.log(image);
        }
    }

    useEffect(() => {
        const observer = lozad()
        observer.observe()
    })

    useEffect(() => {
        fetchBg()
    }, [])


    return (<>
        <Header />
        {/* style={{ backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[b].backdrop_path : ""})` }} */}
        <div style={{ backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[v].backdrop_path : ""})` }}
            className='container-fluid loginBg' >
            {/* <React.Fragment>
                <main> */}
            <div className="row center ">
                <div className="col-12 col-md-6">
                    <div className="loginForm text-center">
                        <h1 className='misty' > Login </h1>
                        <form>
                            <div className="form-group ">
                                <label >Email address</label>
                                <input type="email" className="form-control" required placeholder="Enter E-Mail" />
                            </div>
                            <div className="form-group ">
                                <label >Password</label>
                                <input type="password" className="form-control" required placeholder="Enter a Password" />
                            </div>

                            <button type="submit" className="btn-sm btn btn-outline-warning">Log In</button>
                        </form>
                    </div>
                </div>
                {/* <div className="col-12 col-md-6">
                            <div className="myForm text-center">
                                <h1 className='misty' > Register </h1>
                                <form>
                                    <div className="form-group ">
                                        <label >Email Address</label>
                                        <input type="email" className="form-control" required placeholder="Enter E-Mail" />
                                    </div>
                                    <div className="form-group ">
                                        <label >Display Name</label>
                                        <input type="text" className="form-control" required placeholder="Enter UserName" />
                                    </div>
                                    <div className="form-group ">
                                        <label >Password</label>
                                        <input type="password" className="form-control" required placeholder="Enter a Password" />
                                    </div>

                                    <button type="submit" className="btn-sm btn btn-outline-warning">Sign Up</button>
                                </form>
                            </div>
                        </div> */}
            </div>
            {/* </main>
            </React.Fragment> */}
        </div>
    </>)
}
