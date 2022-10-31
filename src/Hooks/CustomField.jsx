import { useField } from 'formik';
import './CustomField.scss';

const CustomField = ({ ...props }) => {
    const [field, meta] = useField(props);

    return (
        <div className='customField'>
            <span htmlFor={props.label} className='label' >{props.label}</span>
            <input className={meta.error && meta.touched ? 'error' : !meta.error && meta.touched ? 'success' : 'normal'}
                {...field} {...props} />
            <p className="errMsg">{meta.error && meta.touched ? '*' + meta.error : ''}</p>
        </div>
    )
}

export default CustomField;