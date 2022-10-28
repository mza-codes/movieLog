import React from 'react'
import Header from '../../Components/Header/Header'
import logo2 from './logo2.svg'
import './errorLogo.scss'
import useResponsive from '../../Hooks/useResponsive'

function ErrorLogo() {
    const isMobile = useResponsive('down', 'md');
    return (
        <>
            <Header />
            <div className='errorLogo'>
                <h5 className={isMobile ? '' : 'title'}>Uh'Uh That's an Error !</h5>
                <img src={logo2} alt="404" />
                <h6 className={isMobile ? 'center' : 'message'}>
                    The page you're looking for is Not Found, Perhaps you have mistyped the URL ?</h6>
            </div>
        </>
    )
}

export default ErrorLogo