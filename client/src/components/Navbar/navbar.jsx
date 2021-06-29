import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavItem
} from 'reactstrap';

import { removeToken, getToken } from '../../config/token';

export const NavBar = ({ auth, setAuth }) => {
    const history = useHistory();

    //const [ authOption, setAuthOption ] = useState('');
    const [ isAuth, setIsAuth ] = useState(false);

    useEffect(() => {
        verifyAuth() ? setAuth(true) : setAuth(false);
    }, [auth]);


    const verifyAuth = () => getToken() != null;

    const signout = () => {
        removeToken();
        setIsAuth(!isAuth)
        setAuth(false);
        history.push('/login');
    }

    const login = () => {
        setIsAuth(!isAuth);
        history.push('/login');
    }

    return (
        <div>
            <Navbar color='dark' dark expand='md' fixed='top'>
                <NavbarBrand href='/'><strong>VT SEVA Detroit Walkathon</strong></NavbarBrand>
                <Nav className="mr-auto" navbar></Nav>
                <Nav navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>Account</DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={ () => history.push('/register') }>Register</DropdownItem>
                            <DropdownItem onClick={ () => login() } style={{ display: auth ? 'none' : '' }}>Login</DropdownItem>
                            <DropdownItem onClick={ () =>  signout() } style={{ display: !auth ? 'none' : '' }}>Sign-Out</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <NavItem style={{ color: 'white' }} onClick={ () => history.push('/about') }>About</NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}