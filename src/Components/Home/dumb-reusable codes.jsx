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

import { useEffect, useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
// import Iconify from '../../../components/Iconify';
import Iconify from 'src/components/Iconify';
import * as _ from "lodash";
import { useContext } from 'react';
import { SortResult } from './ResultV2';

// ----------------------------------------------------------------------



export default function ResultSort() {
  const [open, setOpen] = useState(null);
  let localProducts
  const { products, setProducts } = useContext(SortResult)

  const [label, setLabel] = useState('')
  
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const SORT_BY_OPTIONS = [
    { value: 'name', state: '-', label: 'Featured' },
    { value: 'postDate', state: 'date', label: 'Newest' },
    { value: 'price', state: 'priceHigh', label: 'Price: Low-High' },
    { value: 'price', state: '-', label: 'Price: High-Low' }
  ];

  const handleSort = (props, state) => {
    console.log(props, state);
    let sorted
    if (products == null) {
      console.log('storedArray NULL Found FIX THIS');
    } else {
      localProducts = products
      if (state === 'date') {
        console.log('sort by date');
        // sorted = _.sortBy(localProducts, 'date').reverse()
        sorted = _.sortBy(localProducts, 'postDate').reverse()
        // sorted = localProducts.sort((a, b) =>
        //   a.postDate.split('/').reverse().join().localeCompare(b.postDate.split('/').reverse().join()))
      } else if (props === 'price' && state === 'priceHigh') {
        // sorted = localProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        sorted = _.sortBy(localProducts, 'price')
      } else if (props === 'price') {
        // sorted = localProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        sorted = _.sortBy(localProducts, 'price').reverse()
      } else {
        sorted = _.sortBy(localProducts, 'name')
        // sorted = _.sortBy(localProducts, ['name','price'])
      }

      // sessionStorage.setItem("localProducts", JSON.stringify(sorted));
      // setReload(true)
      console.log('SORTED DATA',sorted);
      setProducts(sorted)
      setOpen(null)
      // setReload(true)
      // state= null
      // props = null
    }

  }
  // useEffect(() => {

  // }, [handleSort])
  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        // onClick={() => { setReload(false) }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            // selected={!option.value===''}
            // onChange={() => }
            value={option.value}
            onClick={() => { setLabel(option.label); handleSort(option.value, option.state) }}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// style={{
//   background: `url(${movie?.image || w500 + movie?.poster_path ||
//       w500 + movie?.backdrop_path || ""})`
// }}
