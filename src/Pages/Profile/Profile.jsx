import { updateProfile } from 'firebase/auth';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import { AuthContex } from '../../Contexts/AuthContext';
import CustomInputNative from '../../Hooks/CustomInputNative';
import Iconify from '../../Hooks/Iconify';
import * as Yup from 'yup'
import './Profile.scss';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { DataContext } from '../../Contexts/DataContext';

const Profile = () => {
    const { user, setUser } = useContext(AuthContex);
    const { movieLog } = useContext(DataContext);
    const [errors, setErrors] = useState();
    const [userName, setUserName] = useState('?');
    const handleUpdate = async (values, actions) => {
        console.log(values);
        const { name } = values;
        setUserName(name);
        const element = document.getElementById('updateBtn');
        element.classList.add('hide');
        await updateProfile(user, { displayName: name }).then(() => {
            updateDoc(doc(db, 'webusers', user.uid), {
                userName: name,
                upDatedOn: new Date().toLocaleString(),
            }).then((res) => {
                console.log(res);
                console.log('COMPLETE UPDATE');
            }).catch(err => {
                setErrors(err);
                console.log('UpdateDoc ERR', err);
            });
        }).catch(err => {
            setErrors(err);
            console.log('updateProfile ERR', err);
        });
    };

    const schema = Yup.object().shape({
        name: Yup.string().required('Required Field!').min(5).max(14)
    })

    return (
        <>
            <Header />
            <div className="container-fluid ProfileBg" style={{ background: `url("https://picsum.photos/1920/1080")` }}>
                <div className="row pt-5">
                    <div className="col-12 col-md-6">
                        <div className="profileInfo">
                            <h4 className='mainTitle'>User Details</h4>
                            <p>Name: <b>{user?.displayName || userName}</b></p>
                            <p>Email: <b>{user?.email}</b> <Iconify color={user.emailVerified ? 'lime' : 'red'}
                                icon={user.emailVerified ? 'material-symbols:verified-user' : 'charm:shield-cross'} /> </p>
                            <p>Total Entries: <b>{movieLog?.length}</b> </p>
                            <p>User Since: <b>{user?.metadata?.creationTime?.slice(0, 17)}</b></p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="profileEdit">
                            <h4 className='mainTitle'>Update Profile</h4>
                            <Formik onSubmit={handleUpdate} initialValues={{ name: '' }} validationSchema={schema}>
                                {(props) => (
                                    <Form>
                                        <CustomInputNative name='name' type='text' label='Name' />
                                        {errors?.message && <span className="errorText">{errors?.message}</span>}
                                        <button id='updateBtn' type='submit' disabled={!props.isValid}>Submit</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;