import React from 'react';

import classes from './stats.module.css';

export const Stats = ({ title, stat }) => {
    return (
        <div className={ classes.info + ' p-mb-2 p-mr-2'}>
            <h4>{ title }</h4>
            <h2 className={ classes.heading }>{ stat }</h2>
        </div>
    );
};