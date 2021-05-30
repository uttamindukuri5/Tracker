
import React from 'react';

import classes from './card.module.css';

export const Card = ({ children, title }) => {

    return (
        <div id={ classes.card }>
            <h5>{ title }</h5>
            { children }
        </div>
    );
}