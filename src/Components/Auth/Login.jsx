import Header from '../Header/Header'
import lozad from 'lozad'
import { useEffect, useState } from 'react'
import { POSTER_URL } from '../../Constants/Constants';
import * as Yup from 'yup'
import './auth.scss'
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import CustomInputNative from '../../Hooks/CustomInputNative';

export const Login = () => {
    const [list, setList] = useState([]);
    const route = useNavigate();
    let v = Math.floor(Math.random() * list.length);
    let data = sessionStorage.getItem('top');

    const fetchBg = () => {
        if (!data) {
            // case
        } else {
            let value = JSON.parse(data)
            setList(value)
        }
    }

    useEffect(() => {
        const observer = lozad()
        observer.observe()
    })

    useEffect(() => {
        fetchBg()
    }, [])

    const handleLogin = (values, actions) => {
        console.log(values);
        // sign in code 
    }

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Required Field !').max(30, 'Email too Long !').min(5, 'Email too Short!'),
        password: Yup.string().required('Required Field !').max(30, 'Password too Long !').min(5, 'Password too Short!')
    })

    return (<>
        <Header />
        {/* style={{ backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[b].backdrop_path : ""})` }} */}
        <div style={{ backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[v].backdrop_path : ""})` }}
            className='container-fluid loginBg' >
            <div className="row center ">
                <div className="col-12 ">
                    <div className="loginForm text-center">
                        <h1 className='login pb-3'> Login </h1>
                        <Formik initialValues={{ email: '', password: '' }}
                            validationSchema={loginSchema} onSubmit={handleLogin}>
                            {props => (
                                <Form spellCheck>
                                    <CustomInputNative type='text' name='email' label='Email' />
                                    <CustomInputNative type='password' name='password' label='Password' />
                                    <button type="submit" disabled={!props.isValid}
                                        className={props.isValid ? "btn-sm btn btn-success" :
                                            "btn-sm btn btn-outline-warning"}>Log In</button>
                                    <br />
                                    <p className='link' onClick={() => route('/register')}>Create an Account ?</p>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
