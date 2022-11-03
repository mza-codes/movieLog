import { IconButton, Popover } from '@mui/material'
import { getIdToken, signOut } from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContex } from '../../Contexts/AuthContext'
import { auth, db } from '../../firebaseConfig/firebase'
import Iconify from '../../Hooks/Iconify'
import useResponsive from '../../Hooks/useResponsive'
import Search from '../Search/Search'
import './Header.scss'

const Header = () => {
    const route = useNavigate();
    const isMd = useResponsive('down', 'md');
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useContext(AuthContex);
    const [menuPop, setMenuPop] = useState(null);
    const [notifyPopUp, setNotifyPopUp] = useState(null);

    const openSearch = Boolean(anchorEl);
    const openMenu = Boolean(menuPop);
    const openNotify = Boolean(notifyPopUp);

    return (
        <div>
            <div className="mainHeader">
                <div className="left">
                    <div>
                        <IconButton className='popoverbtn' variant="contained" onClick={e => setAnchorEl(e.currentTarget)}>
                            <Iconify icon='fluent:search-square-24-filled' width={34} height={34} />
                        </IconButton>
                        <Popover
                            open={openSearch}
                            anchorEl={anchorEl}
                            onClose={e => setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}>
                            <div className='searchPopOver'>
                                <h4 className='title'>Search</h4>
                                <Search />
                            </div>
                        </Popover>
                    </div>
                </div>

                <div className="center" onClick={() => route('/')}>
                    <h3 className={isMd ? 'urbanist titleSm' : "urbanist title"}>movieLog.</h3>
                </div>

                <div className="right">
                    <IconButton className='popoverbtn' onClick={e => setNotifyPopUp(e.currentTarget)}>
                        <Iconify icon='ic:baseline-notifications-active' width={26} height={26} />
                    </IconButton>
                    <Popover
                        // id={id}
                        open={openNotify}
                        anchorEl={notifyPopUp}
                        onClose={e => setNotifyPopUp(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                        <div className="notifications">
                            <button onClick={() => route('/')}>Home</button>
                            {user ? <>
                                <button onClick={e => signOut(auth)}>Logout</button>
                                <button onClick={e => route('/profile')}>Profile</button>
                            </> : <>
                                <button onClick={() => route('/login')}>Login</button>
                                <button onClick={() => route('/register')}>Register</button>
                            </>}

                        </div>
                    </Popover>
                    {isMd ? <div>
                        <IconButton className='popoverbtn' variant="contained" onClick={e => setMenuPop(e.currentTarget)}>
                            <Iconify icon='eva:menu-2-outline' width={34} height={34} />
                        </IconButton>
                        <Popover
                            // id={id}
                            open={openMenu}
                            anchorEl={menuPop}
                            onClose={e => setMenuPop(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}>
                            <div className="navPop">
                                <button onClick={() => route('/')}>Home</button>
                                {user ? <>
                                    <button onClick={e => signOut(auth)}>Logout</button>
                                    <button onClick={e => route('/profile')}>Profile</button>
                                </> : <>
                                    <button onClick={() => route('/login')}>Login</button>
                                    <button onClick={() => route('/register')}>Register</button>
                                </>}

                            </div>
                        </Popover>
                    </div> : <>
                        <button onClick={() => route('/')}>Home</button>
                        <button onClick={() => route('/addItem')}>Add Item</button>
                        <button onClick={() => route('/watchLog')}>Log</button>
                        {user ? <> <button onClick={e => signOut(auth)}>Logout</button>
                            <button onClick={e => route('/profile')}>Profile</button>
                        </> : <> <button onClick={() => route('/login')}>Login</button>
                            <button onClick={() => route('/register')}>Register</button>
                        </>} </>}
                </div>

            </div>
        </div>
    )
}

export default Header