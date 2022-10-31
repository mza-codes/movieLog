import axios from 'axios';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useContext } from 'react';
import * as Yup from 'yup';
import Header from '../../Components/Header/Header';
import { API_KEY, TMDB_URL } from '../../Constants/Constants';
import { AuthContex } from '../../Contexts/AuthContext';
import CustomField from '../../Hooks/CustomField';
import Iconify from '../../Hooks/Iconify';
import './AddItem.scss';

const AddItem = () => {

    const { user } = useContext(AuthContex);
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState('');
    const [err, setErrors] = useState({})
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
            let newURL = new URL(url);
        } catch (e) {
            return false;
        }
        return true;
    };

    const isValidMovie = async (query) => {
        try {
            const res = await axios.get(`${TMDB_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`);
            const result = res.data.results;
            if (result.length <= 0) {
                setErrors({ messageTitle: "The Movie Title You have entered is found invalid !" });
                return false;
            };
            const status = result.filter(movie => {
                // return movie?.original_title?.toLowerCase().includes(query) || movie?.title?.toLowerCase().includes(query);
                return movie?.original_title?.toLowerCase() == query || movie?.title?.toLowerCase() == query;
            });

            console.log('FILTERED OUT', status);
            if (status.length <= 0) {

                if (res.data.total_pages <= 1) {
                    setErrors({ messageTitle: "The Movie Title You have entered does not seems to match with tmdb.org titles !" });
                    return false;
                }

            } else {
                return true;
            }



        } catch (e) {
            console.log(e);
            setErrors({ messageTitle: "Server Error" });
        }
    }

    const isValidImage = async (url) => {
        console.log('called isValidIMAGE');
        try {
            // Try 1 //
            const blob = await fetch(url).then(res => res.blob());
            console.log('FETCHED', blob);
            let imgValid = SUPPORTED_FORMATS.includes(blob.type);
            console.log('SUPPORTED FORMATS VALIDATION', imgValid);
            if (!imgValid) {
                setErrors({ message: 'The url you have provided seems to fetch no images,Please verify once more or change url !' });
            }
            return imgValid;
            // Try 1 Close //
        } catch (e) {
            console.log('ERR OCCURED', e);
            setErrors({ message: 'The url you have provided seems to fetch no images,Please verify once more or change url !' })
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
            const { url } = values;
            let array = url.split('/');
            let value = array.length - 1;
            const ext = array[value].split('.');
            let stat = SUPPORTED_IMAGES.includes(ext[1]);
            if (stat === true) {
                // setErrors({});
                setImg(url);
                setValid(true);
            } else {
                setErrors({ message: 'The url you have provided seems to fetch no images,Please verify once more or change url !' });
            }
        } else if (imgValid) {
            setErrors({});
            setImg(values.url);
            setValid(true);
        }
        // Image Validation Complete //
        // Validate Movie Name //
        const validMovie = await isValidMovie(values.name);
        // const { name, year, url, watchDate } = values;
        const [watchedDate, watchedTime] = values.watchDate.split('T');
        console.log('Date Splitted', watchedDate, watchedTime);
        console.log('handleSubmit CALLED');
        console.log(values);

        setLoading(false);
    }

    return (
        <>
            <Header />
            <div className="container-fluid addItemBg" style={{ background: `url("https://picsum.photos/1920/1080")` }}>
                <div className="row pt-5">
                    <div className="col-12 col-md-6">
                        <div className="addData">
                            <h4 className='mainTitle'>Input Data</h4>
                            <Formik onSubmit={handleSubmit} initialValues={{ name: '', year: '', url: '', watchDate: '' }}
                                validationSchema={itemSchema}>
                                {(props) => (
                                    <Form>
                                        <CustomField name='name' type='text' label='Title' />
                                        <CustomField name='year' type='number' label='Year' />
                                        <CustomField name='watchDate' type='datetime-local' label='Watch Date' />
                                        <CustomField name='url' type='text' label='Image URL' />
                                        {loading && <div className="loading"> <div className="loader"></div> </div>}
                                        {<span className="err">{err?.message}</span>}
                                        <span className="err">{err?.messageTitle}</span>
                                        {err?.message?.includes('no images') && <span className='err'>If you see an image preview of
                                            uploaded url, ignore this message ! <br /> However feel free to update the image later, if
                                            there's an error ! </span>}
                                        {!loading && <button type='submit' disabled={!err === {}}>Submit</button>}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="imgPreview">
                            {img && <img src={img} alt="image" />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddItem;