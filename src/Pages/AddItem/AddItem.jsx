import axios from 'axios';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import lozad from 'lozad';
import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flip, toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Header from '../../Components/Header/Header';
import { API_KEY, IMDB_API, TMDB_URL, w500 } from '../../Constants/Constants';
import { AuthContex } from '../../Contexts/AuthContext';
import { DataContext } from '../../Contexts/DataContext';
import { db } from '../../firebaseConfig/firebase';
import CustomField from '../../Hooks/CustomField';
import Iconify from '../../Hooks/Iconify';
import { dateOptions } from '../../Utils/TimeFormats';
import './AddItem.scss';

const AddItem = () => {
    const route = useNavigate();
    const { user } = useContext(AuthContex);
    const { movieLog, setMovieLog } = useContext(DataContext);
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
    const [imgDetails, setImgDetails] = useState({
        file: null,
        modified: "",
        lastModified: "",
        type: ""
    });
    const uploadedImage = useRef();
    const status = document.querySelector('.showSuccess');
    const errRef = useRef();
    console.log(`"%cComponent Rendered"${maxDate}`,"color:red; font-weight: bold;font-family:sans-serif; font-size: 20px");
    
    // Validations
    // const regExURL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

    // Yup Validation is ValidURL
    const isValidUrl = (url) => {
        // let stat = regExURL.test(url);
        // if (!stat) return false;
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
                setErrors({ messageTitle: "The movie title does not match with Database, Have a look at the suggestions !" });
                return false;
            } else {
                setSearchResult(result?.slice(0, 8) || result);
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
        watchDate: Yup.date().required('Required Field').max(maxDate, `${maxDate} Exceeds`)
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
                };
            };
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
            };
            // loads image
            validImg.src = url;
        });
    };

    // Handling Form Submit and Extra Validations
    const handleSubmit = async (values, actions) => {
        console.log('handleSubmit CALLED');
        setImgDetails({ file: null });
        const { name, year, url, watchDate } = values;
        setLoading(true);
        setImgErr("");
        errRef.current.innerText = "";
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
            console.log('FILTERING');
            const exist = await watchData.filter((movie) => {
                return (movie?.name?.toLowerCase() === name.toLowerCase() &&
                    movie?.year === year) || movie?.url === url || movie?.id === watchDate;
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

    // Handling Confirm,Upload to Server
    const handleConfirm = async () => {
        errRef.current.style.color = "#eeff00";
        errRef.current.innerText = "Submitting Data..."
        setLoading(true);
        console.log(data);
        try {
            await updateDoc(doc(db, 'webusers', user.uid), {
                watchData: arrayUnion(data)
            }).then((resp) => {
                console.log('addedData', resp);
                setLoading(false);
                // setImgErr("Data Upload Completed !");
                errRef.current.style.color = "#00ff6a";
                errRef.current.innerText = "Data Added Successfully !";
                setWatchData((current) => ([...current, data]));
                setShowConfirm(false);
                toast.success("Title Added Successfully !", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5200,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    setMovieLog((current) => ([...current, data]));
                    route('/');
                }, 5000);
            }).catch(e => console.log('PromiseErr', e));
        } catch (e) {
            console.log("Error Occured While Data Submission", e);
        };
    };

    useEffect(() => {
        const observer = lozad();
        observer.observe();
    });

    // Loads User WatchData
    const fetchUserData = async () => {
        if (movieLog?.length !== 0) {
            console.log('CONTEXT DATA FOUND');
            setWatchData(movieLog);
            return;
        }
        await getDoc(doc(db, 'webusers', user.uid)).then((res) => {
            const value = res?.data();
            setWatchData(value?.watchData);
            console.log('FETCHED DATA FROM FIRESTORE');
            return true;
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleCopy = (movie, param) => {
        const toastOptions = {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            autoClose: 2000
        };
        if (param === "image") {
            navigator.clipboard.writeText(movie?.image || w500 + movie?.poster_path ||
                w500 + movie?.backdrop_path || "null");
            toast.info("Image URL Copied to clipboard !", toastOptions);
            return true;
        } else if (param === "uploaded") {
            navigator.clipboard.writeText(movie);
            toast.success("Date Copied To Clipboard", toastOptions);
            return true;
        } else {
            navigator.clipboard.writeText(movie?.title || movie?.original_title || "null");
            toast.info("Title Copied to clipboard !", toastOptions);
            return true;
        };
    };

    const handleChange = (e) => {
        let blob = uploadedImage?.current?.files[0];
        setImg(URL.createObjectURL(blob));
        const myDate = new Date(blob?.lastModified).toLocaleString(dateOptions);
        const myDate2 = new Date(blob?.lastModifiedDate).toLocaleString(dateOptions);
        if (blob !== undefined || null) {
            setImgDetails({
                file: uploadedImage?.current?.files[0],
                modified: myDate,
                lastModified: myDate2,
                type: uploadedImage?.current?.files[0]?.type
            });
        };
    };

    return (
        <>
            <Header />
            <ToastContainer transition={Flip} theme={"colored"} />
            <div className="container-fluid addItemBg lozad" style={{ background: `url(${bg ? bg : "https://picsum.photos/1920/1080"})` }}>
                <div className="row pt-5">
                    <div className="col-12 col-md-6 col-lg-4">
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
                                        <span ref={errRef} className="err showSuccess">{imgErr}</span>
                                        {!loading && <button type='submit'>Submit</button>}
                                        <label htmlFor="uploadFile">Upload Image</label>
                                        <input ref={uploadedImage} type="file" id='uploadFile' accept='image/*' hidden
                                            onChange={(e) => { handleChange(e); }} />
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        {showConfirm && <div className="confirm center p-2">
                            <button onClick={handleConfirm} className="confimBtn p-2">
                                Confirm <Iconify icon='charm:shield-tick' /> </button>
                        </div>}
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        {searchResult?.length !== 0 && suggestions?.length === 0 &&
                            <h4 style={{ margin: '15px 0px', textAlign: 'center' }}>Search Result</h4>}
                        <div className="suggestionsContainer">
                            {suggestions?.length === 0 && searchResult?.map((movie) => (
                                <div key={movie?.id} className="suggestionItem lozad"
                                    onClick={e => setImg(movie?.image || w500 + movie?.poster_path
                                        || w500 + movie?.backdrop_path)}>
                                    <span className='pointer' onClick={e => { handleCopy(movie, "title") }}>
                                        <b>{movie?.title?.slice(0, 20) || movie?.original_title?.slice(0, 20)}</b>
                                    </span>
                                    <span>{movie?.resultType || "" + " " + movie?.release_date ||
                                        movie?.description?.slice(0, 14) || ""}</span>
                                    <span className='icon'> <a href={`https://imdb.com/title/${movie?.id}`} target='_blank'
                                        rel='noreferrer'>
                                        <Iconify icon='fontisto:imdb' color='#DBA506' borderRadius={1}
                                            height={20} width={20} /></a>
                                    </span>
                                    <span className='icon2' onClick={e => { handleCopy(movie, "image") }}>
                                        <Iconify icon='ci:link' color='inherit' borderRadius={1} height={24} width={24} />
                                    </span>
                                </div>))}
                            {searchResult?.length !== 0 && suggestions?.length === 0 && <div className="resBtns">
                                <button>
                                    <Iconify icon="bxs:chevron-left-square" height={28} width={28} color="inherit" />
                                </button>
                                <button>
                                    <Iconify icon="bxs:chevron-right-square" height={28} width={28} color="inherit" />
                                </button>
                            </div>}
                        </div>
                        {searchResult?.length === 0 && suggestions?.length !== 0 &&
                            <h4 style={{ margin: '15px 0px', textAlign: 'center' }}>Suggestions</h4>}
                        <div className="suggestionsContainer">
                            {searchResult?.length === 0 && suggestions?.slice(0, 16).map((movie) => (
                                <div key={movie?.id} className="suggestionItem lozad"
                                    onClick={e => setImg(movie?.image || w500 + movie?.poster_path
                                        || w500 + movie?.backdrop_path)}>
                                    <span className='pointer' onClick={e => { handleCopy(movie, "title") }}>
                                        <b>{movie?.title?.slice(0, 20) || movie?.original_title?.slice(0, 20)}</b>
                                    </span>
                                    <span>{movie?.resultType || "" + " " + movie?.release_date || movie?.description?.slice(0, 14) || ""}</span>
                                    <span className='icon'> <a href={`https://imdb.com/title/${movie?.id}`} target='_blank'
                                        rel='noreferrer'>
                                        <Iconify icon='fontisto:imdb' color='#DBA506' borderRadius={1}
                                            height={20} width={20} /></a>
                                    </span>
                                    <span className='icon2' onClick={e => handleCopy(movie, "image")}>
                                        <Iconify icon='ci:link' color='inherit' borderRadius={1} height={24} width={24} />
                                    </span>
                                </div>))}
                            {searchResult?.length === 0 && suggestions?.length !== 0 && <div className="resBtns">
                                <button >
                                    <Iconify icon="bxs:chevron-left-square" height={28} width={28} color="inherit" />
                                </button>
                                <button>
                                    <Iconify icon="bxs:chevron-right-square" height={28} width={28} color="inherit" />
                                </button>
                            </div>}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="imgPreview">
                            {img && <img className='lozad' src={img} alt="_preview" />}
                            <div className="uploadedInfo">
                                {imgDetails?.file && <>
                                    <h6>Uploaded Image Details</h6>
                                    <p onClick={e => handleCopy(imgDetails?.modified, "uploaded")}>
                                        Modified Date: <b>{imgDetails?.modified}</b>
                                    </p>
                                    <p>Type: <b>{imgDetails?.type}</b></p>
                                    <p onClick={e => handleCopy(imgDetails?.lastModified, "uploaded")}>
                                        LastModified: <b>{imgDetails?.lastModified}</b>
                                    </p>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddItem;