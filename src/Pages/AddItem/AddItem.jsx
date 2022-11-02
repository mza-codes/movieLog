import { uuidv4 } from '@firebase/util';
import { MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import lozad from 'lozad';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import * as Yup from 'yup';
import Header from '../../Components/Header/Header';
import { API_KEY, IMDB_API, TMDB_URL } from '../../Constants/Constants';
import { AuthContex } from '../../Contexts/AuthContext';
import { db } from '../../firebaseConfig/firebase';
import CustomField from '../../Hooks/CustomField';
import Iconify from '../../Hooks/Iconify';
import './AddItem.scss';

const AddItem = () => {

    const { user } = useContext(AuthContex);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showWarn, setWarn] = useState({
        img: false,
        title: false
    });
    const [previousSubmit, setPreviousSubmit] = useState({
        query: "",
        image: "",
        queryStatus: false,
        imageStatus: false,
    });
    const [data, setData] = useState({});
    const [img, setImg] = useState('');
    const [err, setErrors] = useState({ message: "", messageTitle: "" });
    const [imgErr, setImgErr] = useState("");
    const [valid, setValid] = useState(false);
    const maxYear = new Date().getFullYear();
    const maxDate = new Date().toLocaleString();
    console.log('Payload to Upload', data);

    // Validations
    const regExURL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

    // Yup Validation is ValidURL
    const isValidUrl = (url) => {
        let stat = regExURL.test(url);
        if (!stat) return false;
        try {
            new URL(url);
        } catch (e) {
            return false;
        }
        return true;
    };

    // Movie title validation -- exact match
    const isValidIMDBMovie = async (query, year) => {
        if (previousSubmit.query === query) return previousSubmit.queryStatus;
        try {
            let imdbRes = await axios.get(`https://imdb-api.com/en/API/SearchMovie/${IMDB_API}/${query}%20${year}`);
            console.log('Fetched Response ::=>', imdbRes);
            const result = imdbRes?.data?.results;
            if (result.length <= 0) {
                setErrors({ messageTitle: "Invalid title, 0 results found for your title !" });
                const isValidTMDB = await isValidMovie(query, year);
                return isValidTMDB;
            };
            const status = result.filter(movie => {
                return movie?.title?.toLowerCase() === query.toLowerCase();
            });
            console.log('FILTERED STATUS', status);
            if (status?.length <= 0) {
                //  do additional page searching here if required ! 
                setSuggestions(result);
                setErrors({ messageTitle: "The movie title does not match with Database, Have a look at our suggestions !" });
                return false;
            } else {
                setSuggestions(result?.slice(0, 5));
                return true;
            }

        } catch (e) {
            console.log(e);
            setErrors({ messageTitle: "Server Error" });
            return false;
        }
    }
    // TMDB Query if result is 0 on previous
    const isValidMovie = async (query, year) => {
        try {
            const res = await axios.get(`${TMDB_URL}/search/movie?api_key=${API_KEY}&query=${query}&year=${year}`);
            const result = res.data.results;
            if (result.length <= 0) {
                setErrors({ messageTitle: "The movie title is found invalid, 0 results found from Server !" });
                return false;
            };
            const status = result.filter(movie => {
                return movie?.original_title?.toLowerCase() === query.toLowerCase()
                    || movie?.title?.toLowerCase() === query.toLowerCase();
            });

            if (status.length <= 0) {
                //  do additional page searching here if required ! 
                setSuggestions(result);
                setErrors({ messageTitle: "The movie title does not match with Database, Have a look at our suggestions !" });
                return false;
            } else {
                setSuggestions(result?.slice(0, 5));
                return true;
            }

        } catch (e) {
            console.log(e);
            setErrors({ messageTitle: "Server Error" });
            return false;
        }
    };

    // Yup Validation Schema
    const itemSchema = Yup.object().shape({
        name: Yup.string().required('Required Field').min(3).max(70),
        year: Yup.number().required('Required Field').min(1888, 'Invalid Year').max(maxYear, 'You must be kidding !'),
        url: Yup.string().required('Required Field').min(7, 'Invalid Image URL')
            .test('is-url-valid', 'URL is not valid', (value) => isValidUrl(value)),
        watchDate: Yup.date().required('Required Field').max(maxDate, 'Date.now() is Max')
    });

    // Image Validation more Reliable 
    const validateImage = url => {
        if (previousSubmit.image === url) { setImg(url); return previousSubmit.imageStatus; }
        return new Promise((resolve, reject) => {
            const validImg = new Image()
            // the following handler will fire after a successful loading of the image
            validImg.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = validImg;

                if (height < 300 && width < 300) {
                    console.log('INSIDE IF');
                    setImgErr(`The Image Dimensions must be a minimum of 300 ! Current Image Size: ${width}x${height}`);
                    setValid(false);
                    setWarn((current) => ({
                        ...current,
                        img: true
                    }));
                    resolve(false);
                } else {
                    // Image OK
                    setImg(url);
                    setWarn((current) => ({
                        ...current,
                        img: false
                    }));
                    resolve(true);
                }
            }
            // respond with error if invalid image
            validImg.onerror = () => {
                console.log('FAILED cc');
                setImgErr("Error Fetching Image from provided url, Please Verify Source!");
                setValid(false);
                setWarn((current) => ({
                    ...current,
                    img: true
                }));
                resolve(false);
            }
            // loads image
            validImg.src = url;
        })
    }

    const handleSubmit = async (values, actions) => {
        console.log('handleSubmit CALLED');
        setLoading(true);
        setImgErr("");
        setErrors({ messageTitle: "" });
        setImg(null);
        setPreviousSubmit((current) => ({
            ...current,
            query: values.name,
            image: values.url,
        }));

        // Validate Movie title  //
        const validMovie = await isValidIMDBMovie(values.name, values.year);
        console.log('VALIDMOVIE ===', validMovie);
        if (!validMovie) {
            setWarn((current) => ({
                ...current,
                title: true
            }));
        } else {
            setErrors({ messageTitle: "" });
            setWarn((current) => ({
                ...current,
                title: false
            }));
        };

        const isValidImg = await validateImage(values.url);
        setPreviousSubmit((current) => ({
            ...current,
            queryStatus: validMovie,
            imageStatus: isValidImg
        }));
        console.log('isValidIMG ? >>', isValidImg);
        // Set Data to Payload
        const { name, year, url, watchDate } = values;
        const [watchedDate, watchedTime] = values.watchDate.split('T');
        const id = values.watchDate;
        let createdAt = new Date().toLocaleString();
        setData({
            id, name, year, url, watchedDate, watchedTime, watchCount: 1, createdAt
        });

        if (isValidImg && validMovie) {
            console.log(values);
            console.log('ALL SET');
            setLoading(false);
            setShowConfirm(true);
            return;
        };
        setLoading(false);
    };

    const handleConfirm = async () => {
        setLoading(true);
        console.log(data);
        try {
            await updateDoc(doc(db, 'webusers', user.uid), {
                watchData: arrayUnion(data)
            }).then((resp) => {
                console.log('addedData', resp);
                setLoading(false);
                setImgErr("Completed Upload");
                setShowConfirm(false);
                return;
            }).catch(e => console.log('PromiseErr', e));

        } catch (e) {
            console.log("Error Occured While Data Submission", e);
        }
    };

    const handleFill = (movie) => {
        console.log('fill called');
        let oldValues = { name: data.name, image: data.url };
        let newValues = {
            name: showWarn.title ? movie?.title : data.name,
            image: showWarn.img ? movie?.url : data.url
        };
        setData((current) => ({
            ...current,
            name: showWarn.title ? movie?.title : current.name,
            url: showWarn.img ? movie?.url : current.url
        }));
        setWarn((current) => ({
            ...current,
            title: oldValues.name === newValues.name ? current.title : false,
            img: oldValues.image === newValues.image ? current.img : false
        }));
        setShowConfirm(true);
    };

    useEffect(() => {
        const observer = lozad();
        observer.observe();
    });

    return (
        <>
            <Header />
            <div className="container-fluid addItemBg lozad" style={{ background: `url("https://picsum.photos/1920/1080")` }}>
                <div className="row pt-5">
                    <div className="col-12 col-md-6">
                        <div className="addData">
                            <h4 className='mainTitle'>Input Data</h4>
                            <Formik onSubmit={handleSubmit} initialValues={{ name: '', year: '', url: '', watchDate: '', lov: "" }}
                                validationSchema={itemSchema}>
                                {(props) => (
                                    <Form>
                                        <CustomField name='name' type='text' label='Title' warn={+showWarn.title} />
                                        <CustomField name='year' type='number' label='Year' />
                                        <CustomField name='watchDate' type='datetime-local' label='Watch Date' />
                                        <CustomField name='url' type='text' label='Image URL' warn={+showWarn.img} />

                                        {loading && <div className="loading"> <p className="text">
                                            Verifying Data... </p>
                                            <div className="loader"></div>
                                        </div>}
                                        <span className="err">{err?.messageTitle}</span>
                                        <span className="err">{imgErr}</span>
                                        {!loading && <button type='submit'>Submit</button>}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        {showConfirm && <div className="confirm center p-2">
                            <button onClick={handleConfirm} className="confimBtn p-2">
                                Confirm <Iconify icon='charm:shield-tick' /> </button>
                        </div>}
                    </div>
                    <div className="col-12 col-md-6">
                        {suggestions?.length !== 0 && <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>Suggestions</h4>}
                        <div className="suggestionsContainer">
                            {suggestions?.map((movie) => (
                                <div key={movie?.id} className="suggestionItem lozad" onClick={e => handleFill(movie)}
                                    style={{ background: `url(${movie?.image || ""})` }} >
                                    <span><b>{movie?.title?.slice(0, 20)}</b></span>
                                    <span>{movie?.resultType}&nbsp;{movie?.description?.slice(0, 6)}</span>
                                    <span className='icon'> <a href={`https://imdb.com/title/${movie?.id}`} target='_blank'
                                        rel='noreferrer'>
                                        <Iconify icon='fontisto:imdb' color='#DBA506' borderRadius={1}
                                            height={20} width={20} /></a>
                                    </span>
                                </div>))}
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="imgPreview">
                            <div id="validImg"></div>
                            {img && <img className='lozad' src={img} alt="_preview" />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddItem;