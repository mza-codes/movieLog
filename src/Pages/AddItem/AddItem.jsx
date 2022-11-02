import axios from 'axios';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import lozad from 'lozad';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Header from '../../Components/Header/Header';
import { API_KEY, IMDB_API, TMDB_URL, w500 } from '../../Constants/Constants';
import { AuthContex } from '../../Contexts/AuthContext';
import { db } from '../../firebaseConfig/firebase';
import CustomField from '../../Hooks/CustomField';
import Iconify from '../../Hooks/Iconify';
import './AddItem.scss';

const AddItem = () => {
    const { user } = useContext(AuthContex);
    const [watchData, setWatchData] = useState([]);
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
        year: "",
        queryStatus: false,
        imageStatus: false,
        updateTitle: false,
        updateImage: false
    });
    const [data, setData] = useState({});
    const [img, setImg] = useState('');
    const [err, setErrors] = useState({ message: "", messageTitle: "" });
    const [imgErr, setImgErr] = useState("");
    const [valid, setValid] = useState(false);
    const maxYear = new Date().getFullYear();
    const maxDate = new Date().toLocaleString();
    const [searchResult, setSearchResult] = useState([]);
    const [bg, setBg] = useState(null);
    const status = document.querySelector('.showSuccess');

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
        if (previousSubmit.query === query && previousSubmit.year === year) return previousSubmit.queryStatus;
        try {
            // // IMDB SEARCH CALL
            let imdbRes = await axios.get(`https://imdb-api.com/en/API/SearchMovie/${IMDB_API}/${query}%20${year}`);
            console.log('Fetched RESULT IMDB ::=>', imdbRes);
            const result = imdbRes?.data?.results;
            // const result = [];
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
                setSearchResult(result?.slice(0, 8));
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
            console.log('FETCHED RESULT TMDB', result);
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
                setSearchResult(result?.slice(0, 8));
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
        const { name, year, url, watchDate } = values;
        setLoading(true);
        setImgErr("");
        status.innerText = "";
        setErrors({ messageTitle: "" });
        setImg(null);
        setPreviousSubmit((current) => ({
            ...current,
            query: values.name,
            image: values.url,
            year: values.year
        }));

        // Verifying Duplicate in DB
        if (watchData.length !== 0) {
            const exist = await watchData.filter((movie) => {
                return movie?.name?.toLowerCase() === name &&
                    movie?.year === year || movie?.url === url || movie?.id === watchDate;
            });
            if (exist?.length !== 0) {
                // case
                console.log('Duplicate found !');
                setWarn((current) => ({
                    ...current,
                    img: true,
                    title: true
                }));
                setErrors({ messageTitle: "Similar title/url/id found in your WatchData, Duplicate Entries Not Allowed !" });
                setImg(url);
                setImgErr("Please Verify Before Submit !");
                setLoading(false);
                return false;
            };
        };

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

        // Validate Image
        const isValidImg = await validateImage(values.url);
        setPreviousSubmit((current) => ({
            ...current,
            queryStatus: validMovie,
            imageStatus: isValidImg,
            updateTitle: showWarn.title,
            updateImage: showWarn.img
        }));
        console.log('isValidIMG ? >>', isValidImg);

        // Set Data to Payload
        const [watchedDate, watchedTime] = values.watchDate.split('T');
        let createdAt = new Date().toLocaleString();
        setData({
            id: watchDate, name, year, url, watchedDate, watchedTime, watchCount: 1, createdAt
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

        status.style.color = "#eeff00";
        status.innerText = "Submitting Data..."
        setLoading(true);
        console.log(data);
        try {
            await updateDoc(doc(db, 'webusers', user.uid), {
                watchData: arrayUnion(data)
            }).then((resp) => {
                console.log('addedData', resp);
                setLoading(false);
                // setImgErr("Data Upload Completed !");
                status.style.color = "#00ff6a";
                status.innerText = "Data Added Successfully !";
                setWatchData((current) => ([...current, data]));
                setShowConfirm(false);
                return true;
            }).catch(e => console.log('PromiseErr', e));

        } catch (e) {
            console.log("Error Occured While Data Submission", e);
        }
    };

    useEffect(() => {
        const observer = lozad();
        observer.observe();
    });

    // Loads User WatchData
    const fetchUserData = async () => {
        await getDoc(doc(db, 'webusers', user.uid)).then((res) => {
            const value = res?.data();
            setWatchData(value?.watchData);
            return true;
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const testFnc = async () => {
        console.log('CALLED FILT');
    };

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="container-fluid addItemBg lozad" style={{ background: `url(${bg ? bg : "https://picsum.photos/1920/1080"})` }}>
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
                                        <p id="submitting"></p>
                                        {loading && <div className="loading"> <p className="text">
                                            Verifying Data... </p>
                                            <div className="loader"></div>
                                        </div>}
                                        <span className="err">{err?.messageTitle}</span>
                                        <span className="err showSuccess">{imgErr}</span>
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
                        {searchResult?.length !== 0 && suggestions?.length === 0 &&
                            <h4 style={{ margin: '15px 0px', textAlign: 'center' }}>Search Result</h4>}
                        <div className="suggestionsContainer">
                            {suggestions?.length === 0 && searchResult?.map((movie) => (
                                <div key={movie?.id} className="suggestionItem lozad"
                                    onClick={e => setBg(movie?.image || w500 + movie?.poster_path || w500 + movie?.backdrop_path)}
                                    style={{
                                        background: `url(${movie?.image || w500 + movie?.poster_path ||
                                            w500 + movie?.backdrop_path || ""})`
                                    }} >
                                    <span className='pointer' onClick={e => {
                                        navigator.clipboard.writeText(movie?.title);
                                        toast.info("Title Copied to clipboard !", {
                                            position: toast.POSITION.TOP_CENTER
                                        });
                                    }}><b>{movie?.title?.slice(0, 20) || movie?.original_title?.slice(0, 20)}</b></span>
                                    <span>{movie?.resultType}&nbsp;{movie?.description?.slice(0, 20) || movie?.release_date}</span>
                                    <span className='icon'> <a href={`https://imdb.com/title/${movie?.id}`} target='_blank'
                                        rel='noreferrer'>
                                        <Iconify icon='fontisto:imdb' color='#DBA506' borderRadius={1}
                                            height={20} width={20} /></a>
                                    </span>
                                    <span className='icon2' onClick={e => {
                                        navigator.clipboard.writeText(movie?.image || w500 + movie?.poster_path ||
                                            w500 + movie?.backdrop_path || "");
                                        toast.info("Image URL Copied to clipboard !", {
                                            position: toast.POSITION.TOP_CENTER
                                        });
                                    }}>
                                        <Iconify icon='ci:link' color='inherit' borderRadius={1} height={24} width={24} />
                                    </span>
                                </div>))}
                        </div>
                        {searchResult?.length === 0 && suggestions?.length !== 0 &&
                            <h4 style={{ margin: '15px 0px', textAlign: 'center' }}>Suggestions</h4>}
                        <div className="suggestionsContainer">
                            {searchResult?.length === 0 && suggestions?.map((movie) => (
                                <div key={movie?.id} className="suggestionItem lozad"
                                    onClick={e => setBg(movie?.image || w500 + movie?.poster_path || w500 + movie?.backdrop_path)}
                                    style={{
                                        background: `url(${movie?.image || w500 + movie?.poster_path ||
                                            w500 + movie?.backdrop_path || ""})`
                                    }} >
                                    <span className='pointer' onClick={e => {
                                        navigator.clipboard.writeText(movie?.title);
                                        toast.info("Title Copied to clipboard !", {
                                            position: toast.POSITION.TOP_CENTER
                                        });
                                    }}><b>{movie?.title?.slice(0, 20) || movie?.original_title?.slice(0, 20)}</b></span>
                                    <span>{movie?.resultType}&nbsp;{movie?.description?.slice(0, 20) || movie?.release_date}</span>
                                    <span className='icon'> <a href={`https://imdb.com/title/${movie?.id}`} target='_blank'
                                        rel='noreferrer'>
                                        <Iconify icon='fontisto:imdb' color='#DBA506' borderRadius={1}
                                            height={20} width={20} /></a>
                                    </span>
                                    <span className='icon2' onClick={e => {
                                        navigator.clipboard.writeText(movie?.image || w500 + movie?.poster_path ||
                                            w500 + movie?.backdrop_path || "");
                                        toast.info("Image URL Copied to clipboard !", {
                                            position: toast.POSITION.TOP_CENTER
                                        });
                                    }}>
                                        <Iconify icon='ci:link' color='inherit' borderRadius={1} height={24} width={24} />
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