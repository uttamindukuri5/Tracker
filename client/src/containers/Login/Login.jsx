import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import { login } from '../../api/endpoint';
import { Card } from '../../components/Card/card';

import classes from './login.module.css';

export const Login = ({ setAuth }) => {
    const history = useHistory();

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showMessage, setShowMessage ] = useState(false);

    const validate = (data) => {
        let errors = {};

        if (!username) {
            errors.name = 'Name is required.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        }

        return errors;
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const onSubmit = async () => {
        const data = {
            user: {
                userId: username,
                password
            }
        };
        const response = await login(data);
        if (response.status === 200) {
            setAuth(true);
            history.push('/');
        } else {
            setShowMessage(true);
        }
        reset();
    };

    const reset = () => {
        setUsername('');
        setPassword('');
    }
    const dialogFooter = <div><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;



    return (
        <div className={classes.container}>
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    <i className='pi pi-times-circle' style={{ fontSize: '5rem', color: 'red' }}></i>
                    <h5>Incorrect Authentication</h5>
                    <p>Either User Name or Password is Incorrect</p>
                </div>
            </Dialog>
            <Card  title='LOGIN'>
                <Form onSubmit={onSubmit} validate={ validate } render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="username" render={({ input, meta }) => (
                            <div className={ classes.inputField }>
                                <span className="p-float-label">
                                    <InputText id="username" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} onChange={ e => setUsername(e.target.value) } value={ username }/>
                                    <label htmlFor="username" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Username*</label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Field name="password" render={({ input, meta }) => (
                            <div className={ classes.inputField }>
                                <span className="p-float-label">
                                    <Password id='password' {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} onChange={ e => setPassword(e.target.value) } value={ password } toggleMask feedback={ false }/>
                                    <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Button type="submit" label="Submit" className="p-mt-2" />
                    </form>
                )} />
            </Card>
        </div>
    )
}