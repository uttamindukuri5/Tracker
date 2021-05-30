import React, { useState } from 'react';
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
import classes from './navbar.module.css';


export const NavBar = () => {
    const history = useHistory();

    const isAuth = () => getToken() != null;

    const displayAuthOption = () => {
        console.log('IS AUTH: ', isAuth())
        if (isAuth()) {
            return [<DropdownItem onClick={ () => onAuth() }>Log out</DropdownItem>]
        } else {
            return [
                <DropdownItem onClick={ () => onAuth() }>Sign In</DropdownItem>,
                <DropdownItem onClick={ () => history.push('/register') }>Register</DropdownItem>
            ]
        }
    }

    const onAuth = () => {
        if (!isAuth()) {
            history.push('/login')
        } else {
            removeToken();
            history.push('/')
        }
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
                            { displayAuthOption() }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Navbar>
        </div>
    )
}