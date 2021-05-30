import React, { useState, useEffect } from 'react';

import { AdvanceTable } from '../../components/Table/Advanced/advanceTable';
import { Modal } from '../../components/Modal/modal';

import { getAllUser } from '../../api/endpoint';

import classes from './leaderboard.module.css';


export const Leaderboard = () => {
    const
        [ data, setData ] = useState([]),
        [ viewUser, setViewUser ] = useState({}),
        [ hideModal, setHideModal ] = useState(false);

    useEffect(() => {
        (async() => {
            const response = await getAllUser();
            console.log('RESPONSE: ', response);
            if (response.status === 200) {
                console.log('LEADERBOARD', response.data.data);
                setData(response.data.data);
            }
        })();
    }, [setData]);

    return (
        <div className={ classes.data } >
            <AdvanceTable data={ data } setUser={ setViewUser } setModal={ setHideModal } />
            <Modal data={ viewUser } visible={ hideModal } changeVisibility={ setHideModal }/>
        </div>
    )
}