import { TextField } from "@mui/material";

const { useField } = require("formik");

const CustomInput = ({ ...props }) => {
    const [field, meta] = useField(props);
    console.log(field,'<Field <|> Meta>',meta);
    return (
        <div>
            <TextField
                // danger={meta.touched} <span className="errorInput"> </span>
                // helperText={meta.error && meta.touched ? meta.error : ''}
                // // color='foggy'
                color={meta.error && meta.touched ? 'error' : !meta.error && meta.touched ? 'success' : 'primary'}
                margin="normal" focused {...field} {...props} sx={{backgroundColor:'white'}} />
            <br /><span className="errorText">{meta.error && meta.touched ? '*'+meta.error : ''}</span>
            {/* {meta.error && meta.touched && <h6 className="errorText smallFont" id="feedback" >*{meta.error}</h6>} */}
        </div>
    )
}

export default CustomInput;