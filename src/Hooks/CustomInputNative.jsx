import './CustomInputNative.scss'
const { useField } = require("formik");

const CustomInputNative = ({ ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className='CustomInput'>
            <input
                className={meta.error && meta.touched ? 'error' : !meta.error && meta.touched ? 'success' : 'normal'}
                {...field} {...props} />
            <br /><p className="errorText">{meta.error && meta.touched ? '*' + meta.error : ''}</p>
        </div>
    )
}

export default CustomInputNative;