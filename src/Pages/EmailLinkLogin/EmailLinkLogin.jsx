import { Typography } from '@mui/material';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { AuthContex } from '../../Contexts/AuthContext';
import { auth, db } from '../../firebaseConfig/firebase';
import './EmailLinkLogin.scss'

const EmailLinkLogin = () => {

    const route = useNavigate();
    const [errors, setErrors] = useState();
    const {setUser} = useContext(AuthContex);
    const monitor = async () => {
        setTimeout(() => {
            const msg = document.getElementById('tooLong');
            if (msg) {
                msg.style.display = 'block';

            } else {

                return false;
            }
        }, 35000);
    };

    useEffect(() => {
        emailLinkLogin();
        monitor();
    }, []);

    const emailLinkLogin = async () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            signInWithEmailLink(auth, email, window.location.href)
                .then(async (result) => {
                    window.localStorage.removeItem('emailForSignIn');
                    console.log(result);
                    console.log('FETCHED USER', result.user);
                    setUser(result.user);
                    const snap = await getDoc(doc(db, 'webusers', result.user.uid))
                    if (snap.exists()) {
                        console.log('DATA EXISTS');
                        route('/');
                    } else {
                        setDoc(doc(db, "webusers", result.user.uid), {
                            userName: "",
                            email: result?.user?.email,
                            emailVerified: result?.user?.emailVerified,
                            joinDate: result?.user?.metadata?.creationTime,
                            joinedTime: result?.user?.metadata?.createdAt,
                            ownerId: result?.user?.uid,
                            watchData: []
                        });
                        console.log('ADDED DATA');
                        route('/');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setErrors(error);
                });
        }
    }

    return (
        <>
            <Header />
            <div className="page">
                <div className="emailLogin">
                    <div className="loader" />
                    <Typography sx={{ font: 'inherit', fontWeight: '900' }} variant='overline'>
                        Please Wait While </Typography>
                    {/* <h6>Please Wait While Signing You In</h6> */}
                    <button className="button">
                        <span className="actual-text">&nbsp;Signing&nbsp;You&nbsp;In...</span>
                        <span className="hover-text" aria-hidden="true">&nbsp;Signing&nbsp;You&nbsp;In...&nbsp;&nbsp;</span>
                    </button>
                    <p className='hide animate'>{errors?.message}</p>
                    <p id='tooLong' className='hide animate'>Taking too Long ? <br />
                        Try Verifying through link Once more !</p>
                    <div className="wowC"></div>
                </div>
            </div>
        </>
    )
}

export default EmailLinkLogin;