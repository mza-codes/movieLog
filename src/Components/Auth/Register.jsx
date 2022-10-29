import Header from '../Header/Header'
import lozad from 'lozad'
import { useContext, useEffect, useState } from 'react'
import { POSTER_URL } from '../../Constants/Constants';
import * as Yup from 'yup'
import './auth.scss'
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import CustomInputNative from '../../Hooks/CustomInputNative';
import {
    GoogleAuthProvider, sendSignInLinkToEmail, signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../../firebaseConfig/firebase';
import { IconButton } from '@mui/material';
import Iconify from '../../Hooks/Iconify';
import { AuthContex } from '../../Contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const Register = () => {
    const [list, setList] = useState([]);
    const [errors, setErrors] = useState()
    const route = useNavigate();
    const [verifyEmail, setVerifyEmail] = useState('')
    let v = Math.floor(Math.random() * list.length);
    let data = sessionStorage.getItem('top');
    const { setUser } = useContext(AuthContex);

    useEffect(() => {
        const observer = lozad()
        observer.observe()
    })

    useEffect(() => {
        if (!data) {
            // case
        } else {
            let value = JSON.parse(data);
            setList(value);
        }
    }, []);

    const disableAccess = () => {
        let element = document.querySelector('.loginForm');
        element.style.display = 'none';
    }

    const handleSignup = (values, actions) => {
        console.log(values);
        setErrors(null)
        const { email } = values
        // sign up code 
        const actionCodeSettings = {
            url: 'http://localhost:3000/emailLinkLogin',
            handleCodeInApp: true,
        };
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                setVerifyEmail(email);
                disableAccess()
                window.localStorage.setItem('emailForSignIn', email);
            })
            .catch((error) => {
                console.log('ERR OCCured => ', error);
                setErrors(error);
            });
    }

    const signInWithGmail = () => {
        console.log('SIGN IN WITH GMAIL');
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider).then(async (result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;

            const newUser = result.user;
            setUser(newUser);
            const snap = await getDoc(doc(db, 'webusers', newUser.uid));
            console.log(snap);
            if (snap.exists()) {
                console.log('DATA EXISTS');
                route('/');
            } else {
                await setDoc(doc(db, "webusers", newUser.uid), {
                    userName: "",
                    email: result?.user?.email,
                    emailVerified: result?.user?.emailVerified,
                    joinDate: result?.user?.metadata?.creationTime,
                    joinedTime: result?.user?.metadata?.createdAt,
                    ownerId: result?.user?.uid
                });
                console.log('ADDED DATA');
                route('/');
            }
            route('/');
        }).catch(err => console.log(err));
    }

    const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Required Field !').max(30, 'Email too Long !').min(5, 'Email too Short!'),
        // password: Yup.string().required('Required Field !').max(30, 'Password too Long !').min(5, 'Password too Short!')
    });

    return (<>
        <Header />
        {/* style={{ backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[b].backdrop_path : ""})` }} */}
        <div style={{
            backgroundImage: `url(${list.length !== 0 ? POSTER_URL + list[v].backdrop_path
                : "https://picsum.photos/1920/1080"})`
        }}
            className='container-fluid loginBg lozad' >
            <div className="row center ">
                <div className="col-12 ">
                    <div className="loginForm text-center">
                        <h1 className='login pb-3'> SignUp </h1>
                        <Formik initialValues={{ email: '' }}
                            validationSchema={SignupSchema} onSubmit={handleSignup}>
                            {props => (
                                <Form spellCheck>
                                    <CustomInputNative type='text' name='email' label='Email' />
                                    <button type="submit" disabled={!props.isValid}
                                        className={"submitBtn btn btn-outline-warning"}>Submit</button>

                                    <p className='link' onClick={() => route('/login')}>Already have an Account ?</p>
                                    {errors?.message && <span className="errorText">{errors?.message}</span>}
                                    <IconButton onClick={signInWithGmail} className='gSignBtn'> <Iconify width={28} height={28}
                                        icon='logos:google-icon' /> </IconButton>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {verifyEmail && <h5 style={{ marginTop: '1rem' }} className="mailSent">
                        Verification Link Successfully sent to "{verifyEmail}" <br />
                        Please Verify Your Email !</h5>}
                    <h6 style={{ margin: '20px' }}>movieLog does not Support SignUp with Email & Password as of Now ! <br />
                        Please Use Email Link Verification For SignUp </h6>
                </div>
            </div>
        </div>
    </>)
}
