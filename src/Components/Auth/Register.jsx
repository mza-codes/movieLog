import Header from '../Header/Header'
import lozad from 'lozad'
import { useContext, useEffect, useState } from 'react'
import { POSTER_URL } from '../../Constants/Constants';
import * as Yup from 'yup'
import './auth.scss'
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import CustomInputNative from '../../Hooks/CustomInputNative';
import { GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig/firebase';
import { Button, IconButton } from '@mui/material';
import Iconify from '../../Hooks/Iconify';
import { AuthContex } from '../../Contexts/AuthContext';
import { collection, doc, getDoc, query, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

export const Register = () => {
    const [list, setList] = useState([]);
    const [errors, setErrors] = useState()
    const route = useNavigate();
    const [verifyEmail, setVerifyEmail] = useState('')
    let v = Math.floor(Math.random() * list.length);
    let data = sessionStorage.getItem('top');
    const { setUser, setUserProp } = useContext(AuthContex);

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
    }, []);

    const disableAccess = () => {
        let element = document.querySelector('.loginForm');
        element.style.display = 'none';
    }

    const handleSignup = (values, actions) => {
        console.log(values);
        setErrors(null)
        const { email, password } = values
        // sign up code 
        const actionCodeSettings = {
            url: 'http://localhost:3000/register',
            handleCodeInApp: true,
        };
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                setVerifyEmail(email);
                disableAccess()
                window.localStorage.setItem('emailForSignIn', email);
                // ...
            })
            .catch((error) => {
                console.log('ERR OCCured => ', error);
                setErrors(error)
                // ...
            });
    }

    const signInWithGmail = () => {
        console.log('SIGN IN WITH GMAIL');
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const newUser = result.user;
            setUser(newUser);
            route('/');
            // const q = query(collection(db, 'webusers'), where('id', '==', newUser.uid))
            // getDocs(q).then((result) => {
            //     if (result.docs.length === 0) {
            //         console.log('No User Document found');
            //         storeUser(newUser)
            //     } else {
            //         console.log('COMPLETE');
            //         route('/')
            //     }
            // })
        }).catch(err => console.log(err));
    }

    const emailLinkLogin = async () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt('Please provide your email for confirmation');
            }
            // The client SDK will parse the code from the link for you.
            signInWithEmailLink(auth, email, window.location.href)
                .then(async(result) => {
                    // Clear email from storage.
                    window.localStorage.removeItem('emailForSignIn');
                    // You can access the new user via result.user
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
                        });
                        console.log('ADDED DATA');
                        route('/');
                    }
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                })
                .catch((error) => {
                    console.log(error);
                    setErrors(error);
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                });
        }
    }

    useEffect(() => {
        emailLinkLogin()
    }, [])

    const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Required Field !').max(30, 'Email too Long !').min(5, 'Email too Short!'),
        // password: Yup.string().required('Required Field !').max(30, 'Password too Long !').min(5, 'Password too Short!')
    })

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
