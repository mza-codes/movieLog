{/* <div className="col-12 text-center singleInput">
                            <label >Select a Number <br /><span>Change Current Background !</span> </label>
                            <select className="form-select text-dark form-select-sm" onChange={(e) => setV(e.target.value)} >
                                <option disabled>Select</option>
                                {list.map((itm, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                            <button onClick={() => setB(v)} className='btn btn-sm btn-outline-warning'>Confirm</button>
                        </div> */}

// {<div className="form-group ">
//                 <label >Email address</label>
//                 <input type="email" name='email' className='form-control'
//                     onChange={(e) => props.setFieldValue('email', e.target.value)}
//                     placeholder="Enter E-Mail" />
//                 {props.touched && !props.isValid && <span>{props?.errors?.email}</span>}
//             </div>
//             <div className="form-group ">
//                 <label >Password</label>
//                 <input type="password" name='password' className='form-control'
//                     onChange={(e) => props.setFieldValue('password', e.target.value)}
//                     placeholder="Enter Password" />
//                 {props.touched && !props.isValid && <span>{props?.errors?.password}</span>}
//             </div>}



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
