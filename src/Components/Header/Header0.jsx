import styled from '@emotion/styled';
import React from 'react'
import { Outlet } from 'react-router-dom';
import Logo from '../Logo';

const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    left: 0,
    lineHeight: 0,
    // width: '100%',
    background: 'inherit',
    position: 'static',
    padding:3,
    // padding: theme.spacing(3, 3, 0),
    // [theme.breakpoints.up('sm')]: {
    //     padding: theme.spacing(5, 5, 0),
    // },
}));

function Header() {
    return (
        <>
            <HeaderStyle >
                <Logo />
            </HeaderStyle>
        </>
    )
}

export default Header;