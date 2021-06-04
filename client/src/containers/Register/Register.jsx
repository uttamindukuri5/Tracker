import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { register } from '../../api/endpoint';
import { Card } from '../../components/Card/card';
import { FormField } from '../../components/Form/field';
import PayPal from '../../components/Paypal';

import data from '../../data/config.json';

import classes from './register.module.css';

export const Register = () => {
    const history = useHistory();

    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ team, setTeam ] = useState('');
    const [ age, setAge ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showMessage, setShowMessage ] = useState(false);
    const [ isRegistered, setIsRegistered ] = useState(false);
    const [ isPaid, setIsPaid ] = useState(false);

    const validate = (data) => {
        let errors = {};

        if (!username) {
            errors.name = 'Name is required.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        }

        if (!firstName) {
            errors.name = 'First Name is required.';
        }

        if (!lastName) {
            errors.name = 'Last Name is required.';
        }

        if (!email) {
            errors.name = 'Email is required.';
        }

        if (!phone) {
            errors.name = 'Phone is required.';
        }

        return errors;
    };

    const dialogFooter = <div><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;


    const displayIcon = () => {
        return isRegistered ?
            <i className='pi pi-check-circle' style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
            :
            <i className='pi pi-times-circle' style={{ fontSize: '5rem', color: 'red' }}></i>;
    };

    const onSubmit = async () => {
        const data = {
            user: {
                firstName,
                lastName,
                email,
                phone,
                team,
                userId: username,
                password
            }
        };
        if (isPaid) {
            const response = await register(data);
            console.log(response);
            if (response.status === 201) {
                reset();
                setIsRegistered(true);
            } else {
                setIsRegistered(false);
            }
        } else {
            setIsRegistered(false);
        }
        setShowMessage(true);
    };

    const reset = () => {
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setAge('');
    };


    return (
        <div className={classes.container}>
            <Dialog visible={showMessage} onHide={() => history.push('/login')} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    { displayIcon() }
                    <h5>{ isRegistered ? 'Successfully Registered' : 'Registration Failed' }</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        { isRegistered ? 'You have been registered' : 'Please fill out all the required field' }
                    </p>
                </div>
            </Dialog>
            <Card  title='REGISTER'>
                <Form onSubmit={onSubmit} validate={ validate } render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <FormField
                                    type='INPUT'
                                    name='firstName'
                                    label='First Name'
                                    value={ firstName }
                                    setValue={ setFirstName }
                                />
                                <FormField
                                    type='INPUT'
                                    name='lastName'
                                    label='Last Name'
                                    value={ lastName }
                                    setValue={ setLastName }
                                />
                                <FormField
                                    type='INPUT'
                                    name='username'
                                    label='Username'
                                    value={ username }
                                    setValue={ setUsername }
                                />
                                <FormField
                                    type='PASSWORD'
                                    name='password'
                                    label='Password'
                                    value={ password }
                                    setValue={ setPassword }
                                />
                                <FormField
                                    type='INPUT'
                                    name='email'
                                    label='Email'
                                    value={ email }
                                    setValue={ setEmail }
                                />
                                <FormField
                                    type='INPUT'
                                    name='phone'
                                    label='Phone'
                                    value={ phone }
                                    setValue={ setPhone }
                                />
                                <FormField
                                    type='INPUT'
                                    name='age'
                                    label='Age'
                                    value={ age }
                                    setValue={ setAge }
                                />
                                <FormField
                                    type='DROPDOWN'
                                    name='team'
                                    label='Team'
                                    value={ team }
                                    setValue={ setTeam }
                                    data={data.team}
                                />
                                <PayPal setPaid={ setIsPaid } />
                                <Button type="submit" label="Submit" className="p-mt-2" />
                            </form>
                        )} />
            </Card>
        </div>
    )
}