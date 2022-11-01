import { MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { Form, Formik } from 'formik';
import lozad from 'lozad';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import * as Yup from 'yup';
import Header from '../../Components/Header/Header';
import { API_KEY, IMDB_API, TMDB_URL } from '../../Constants/Constants';
import { AuthContex } from '../../Contexts/AuthContext';
import CustomField from '../../Hooks/CustomField';
import Iconify from '../../Hooks/Iconify';
import './AddItem.scss';

const AddItem = () => {

    const { user } = useContext(AuthContex);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showWarn, setWarn] = useState({
        img: false,
        title: false
    });
    const [img, setImg] = useState('');
    const [err, setErrors] = useState({ message: "", messageTitle: "" });
    const [imgErr, setImgErr] = useState("");
    const [valid, setValid] = useState(false);
    const maxYear = new Date().getFullYear();
    const maxDate = new Date().toLocaleString();

    // Validations
    const regExURL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

    const FILE_SIZE = 6001200;
    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/bmp", "image/png", "image/webp", "image/svg"];
    const SUPPORTED_IMAGES = ["jpg", "jpeg", "bmp", "png", "webp", "svg"];

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

    const isValidIMDBMovie = async (query, year) => {
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
                setErrors({ messageTitle: "The movie title is found invalid, Have a look at our suggestions !" });
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

    const isValidMovie = async (query, year) => { // TMDB Query
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
                setErrors({ messageTitle: "The movie title is found invalid, Have a look at our suggestions !" });
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

    const isValidImage = async (url) => {
        console.log('called isValidIMAGE');
        try {
            // Try 1 //
            const blob = await fetch(url).then(res => res.blob());
            console.log('FETCHED', blob);
            if (!blob) {
                setImgErr("Error Fetching Image from URL,Please Verify URL !");
                return false;
            }
            let imgValid = SUPPORTED_FORMATS.includes(blob?.type);
            console.log('SUPPORTED FORMATS VALIDATION', imgValid);
            if (!imgValid) {
                setImgErr('The image does not match with regular image extensions! Please verify once more or change url !');
            }
            return imgValid;
            // Try 1 Close //
        } catch (e) {
            console.log('ERR OCCURED', e);
            setImgErr('Server Error, Please Verify URL');
            return false;
        }
    };

    // .test('is-url-valid', 'URL is not valid', (value) => isValidUrl(value))
    // .matches(regURL,'Invalid REGURL')
    const itemSchema = Yup.object().shape({
        name: Yup.string().required('Required Field').min(3).max(70),
        year: Yup.number().required('Required Field').min(1888, 'Invalid Year').max(maxYear, 'You must be kidding !'),
        url: Yup.string().required('Required Field').min(7, 'Invalid Image URL')
            .test('is-url-valid', 'URL is not valid', (value) => isValidUrl(value)),
        watchDate: Yup.date().required('Required Field').max(maxDate, 'Date.now() is Max')
    });

    const handleSubmit = async (values, actions) => {
        setLoading(true);
        // Image URL Validation //
        const imgValid = await isValidImage(values.url);
        if (!imgValid) {
            // setting warning in inputBox
            setWarn((current) => ({
                ...current,
                img: true
            }));
            const { url } = values;
            let array = url.split('/');
            let value = array.length - 1;
            const ext = array[value].split('.');
            let stat = SUPPORTED_IMAGES.includes(ext[1]);

            if (stat === true) {
                setImgErr("");
                setWarn((current) => ({
                    ...current,
                    img: false
                }));
                setImg(url);
                const element = document.getElementById("link");
                element.style.display = 'block';
                element.innerText = "Unable to fetch an image from the provided URL, If you can see a preview of your image, Ignore this message, else please Verify your image by clicking this link, However, feel free to Change your image later if there's an error. ";
                element.href = url;
                console.log(element.parentNode, "<parentNode || parentElement>", element.parentElement);
                // const parent = element.parentNode;
                // const link = document.createElement('a');
                // link.href = url;
                // link.appendChild(element.cloneNode(true));
                // parent.replaceChild(link, element);
                setValid(true);
            } else {
                setImgErr('The url you have provided seems to fetch no images,Please verify once more or change url !');
            }
        } else if (imgValid) {
            setImgErr('');
            setWarn((current) => ({
                ...current,
                img: false
            }));
            setImg(values.url);
            setValid(true);
        }
        // Image Validation Complete //
        // Validate Movie Name //
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
        }
        // const validMovie = await isValidMovie(values.name, values.year);
        // const { name, year, url, watchDate } = values;
        const [watchedDate, watchedTime] = values.watchDate.split('T');
        console.log('Date Splitted', watchedDate, watchedTime);
        console.log('handleSubmit CALLED');
        console.log(values);

        setLoading(false);
    }

    useEffect(() => {
        const observer = lozad();
        observer.observe();
    })

    return (
        <>
            <Header />
            <div className="container-fluid addItemBg" style={{ background: `url("https://picsum.photos/1920/1080")` }}>
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
                                            <div className="loader"></div> </div>}
                                        <span className="err">{err?.messageTitle}</span>
                                        <div className="verifyLink">
                                            <a id="link" className='imgVerifyLink' style={{ display: 'none' }}
                                                target="_blank" rel='noreferrer' ></a>
                                        </div>
                                        <span className="err">{imgErr}</span>
                                        {/* {imgErr !=== "" && <span className='err'>If you see an image preview of
                                            uploaded url, ignore this message ! <br /> However feel free to update the image later, if
                                            there's an error ! </span>} */}
                                        {!loading && <button type='submit'>Submit</button>}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        {suggestions?.length !== 0 && <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>Suggestions</h4>}
                        <div className="suggestionsContainer">
                            {suggestions?.map((movie) => (
                                <div key={movie?.id} className="suggestionItem lozad" onClick={e => console.log('clicked')}
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
                            {img && <img src={img} alt="_preview" />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddItem;