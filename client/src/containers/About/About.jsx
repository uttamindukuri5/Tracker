import React from 'react';

import { Card } from '../../components/Card/card';
import classes from './about.module.css';

export const About = () => {
    return (
        <div className={ classes.container }>
            <Card title='About'>
                <div id={ classes.logo }>
                    <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt='logo'/>
                </div>
                <div>
                <p>VT Seva Detroit Youth Board's 1st Walkathon

By participating in our 1st ever Walkathon, we can be healthy and support 2 causes. All the proceeds goes towards COVID-19 Relief Activities in India and Angels of Hope, MI.

Our Bharath needs our support more than ever for the COVID-19 relief activities. 

When cancer becomes a part of one's life, there is a lot to worry about. Angels of Hope provides financial assistance to the Michigan families in need to ease the burden caused by the disease.

Please register and support</p>
                </div>
                <div>
                    <video width="320" height="240" controls>
                        <source src={`${ process.env.PUBLIC_URL }/tutorial.mp4`} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                </div>
            </Card>
        </div>
    );
};