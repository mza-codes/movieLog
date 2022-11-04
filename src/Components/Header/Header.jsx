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
    let currentRoute = window.location.pathname;
    const openSearch = Boolean(anchorEl);
    const openMenu = Boolean(menuPop);
    const openNotify = Boolean(notifyPopUp);

    const routes = {
        home: "/",
        addItem: "/addItem",
        watchLog: "/watchLog",
        profile: "/profile",
        login: "/login",
        register: "/register",
    };

    const navButtonsHome = [
        <button key="home2" className={currentRoute === routes.home ? "active" : ""}
            onClick={e => route('/')}>Home</button>,
        <button key="login" className={currentRoute === routes.login ? "active" : ""}
            onClick={e => route('/login')}>Login</button>,
        <button key="register" className={currentRoute === routes.register ? "active" : ""}
            onClick={e => route('/register')}>Register</button>
    ];

    const navButtonsUser = [
        <button key="home" className={currentRoute === routes.home ? "active" : ""}
            onClick={e => route('/')}>Home</button>,
        <button key="upload" className={currentRoute === routes.addItem ? "active" : ""}
            onClick={e => route('/addItem')}>Upload</button>,
        <button key="history" className={currentRoute === routes.watchLog ? "active" : ""}
            onClick={e => route('/watchLog')}>WatchLog</button>,
        <button key="profile" className={currentRoute === routes.profile ? "active" : ""}
            onClick={e => route('/profile')}>Profile</button>,
        <button key="logout" onClick={e => signOut(auth)}> Logout</button >
    ];

    return (
        <div>
            <div className="mainHeader">
                <div className="left">
                    <div>
                        <IconButton className='searchPopBtn' variant="contained" onClick={e => setAnchorEl(e.currentTarget)}>
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
                    <IconButton className='notifyPopBtn' onClick={e => setNotifyPopUp(e.currentTarget)}>
                        <Iconify icon='ic:baseline-notifications-active' width={26} height={26} />
                    </IconButton>
                    <Popover
                        open={openNotify}
                        anchorEl={notifyPopUp}
                        onClose={e => setNotifyPopUp(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                        <div className="notifications">
                            {user ? navButtonsUser : navButtonsHome}
                        </div>
                    </Popover>
                    {isMd ? <div>
                        <IconButton className='popoverbtn' variant="contained" onClick={e => setMenuPop(e.currentTarget)}>
                            <Iconify icon='eva:menu-2-outline' width={34} height={34} />
                        </IconButton>
                        <Popover
                            open={openMenu}
                            anchorEl={menuPop}
                            onClose={e => setMenuPop(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}>
                            <div className="navPop">
                                {user ? navButtonsUser : navButtonsHome}
                            </div>
                        </Popover>
                    </div> : <> {user ? navButtonsUser : navButtonsHome} </>}
                </div>

            </div>
        </div>
    )
}

export default Header