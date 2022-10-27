import { IconButton, Popover } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Iconify from '../../Hooks/Iconify'
import useResponsive from '../../Hooks/useResponsive'
import Search from '../Search/Search'
import './Header.scss'

const HeaderMain = 'love'
const Header = () => {
    const route = useNavigate();
    const isMd = useResponsive('down', 'md');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <div className="mainHeader">
                <div className="left">
                    {/* <div className="searchBar">
                        <input type="text" />
                        <button className='btn btn-sm btn-outline-warning'>Search</button>
                    </div> */}
                    <div>
                        <IconButton className='popoverbtn' variant="contained" onClick={handleClick}>
                            <Iconify icon='fluent:search-square-24-filled' width={34} height={34} />
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}>
                            <div className='searchPopOver'>
                                <h4 className='title'>Search</h4>
                                <Search />
                            </div>
                            {/* <IconButton color='warning' >
                                <Iconify icon='fluent:search-square-24-filled' width={34} height={34} /> </IconButton> */}
                        </Popover>
                    </div>
                    {/* {!isMd && <Search />} */}
                </div>
                <div className="center" onClick={() => route('/')}>
                    <h3 className={isMd ? 'titleSm' : "urbanist title"}>movieLog.</h3>
                </div>
                <div className="right">
                    <button onClick={() => route('/')}>Home</button>
                    <button onClick={() => route('/login')}>Login</button>
                    <button onClick={() => route('/register')}>Register</button>
                </div>

            </div>
        </div>
    )
}

export default Header