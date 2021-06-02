import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { removeToken, getToken } from '../../config/token';

export const NavBar = () => {
    const history = useHistory();

    const [ authOption, setAuthOption ] = useState('');
    const [ reload, setReload ] = useState(0);

    useEffect(() => {
        console.log('USE EFFECT: ', verifyAuth());
        verifyAuth() ? setAuthOption('Sign-Out') : setAuthOption('Login');
        setReload(reload + 1);
    }, [reload])


    const verifyAuth = () => getToken() != null;

    const onAuth = () => {
        if (verifyAuth()) {
            removeToken();
            setAuthOption('Login');
            history.push('/login');
        }
        else {
            setAuthOption('Sign-Out');
            history.push('/');
        }
        setReload(reload + 1);
    }

    return (
        <div>
            <Navbar color='dark' dark expand='md' fixed='top'>
                <NavbarBrand href='/'><strong>VT SEVA Cancer Walkathon</strong></NavbarBrand>
                <Nav className="mr-auto" navbar></Nav>
                <Nav navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>Account</DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={ () => history.push('/register') }>Register</DropdownItem>
                            <DropdownItem onClick={ () => onAuth() }>{ authOption }</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Navbar>
        </div>
    )
}