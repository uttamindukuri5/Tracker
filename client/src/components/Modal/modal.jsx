import React from 'react';
import { Dialog } from 'primereact/dialog';

export const Modal = ({ data, visible, changeVisibility })  => {
    return (
        <div>
            <Dialog visible={ visible } onHide={ () => changeVisibility(false) } position='top'>
                <h4>{ data.name }</h4>
                <h2>{ data.track }</h2>
                <p>Team: { data.team }</p>
            </Dialog>
        </div>
    )
}