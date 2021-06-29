import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Steps } from 'primereact/steps';
import { Message } from 'primereact/message';

import { register, getConfig, getUserID } from '../../api/endpoint';
import { validEmail, validPhone } from '../../config/validation';
import { Card } from '../../components/Card/card';
import { FormField } from '../../components/Form/field';
import PayPal from '../../components/Paypal';

import classes from './register.module.css';

export const Register = () => {
    const history = useHistory();

    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ team, setTeam ] = useState('');
    const [ age, setAge ] = useState();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showMessage, setShowMessage ] = useState(false);
    const [ showInfo, setShowInfo ] = useState(true);
    const [ isRegistered, setIsRegistered ] = useState(false);
    const [ step, setStep ] = useState('User Registration');
    const [ isPaid, setIsPaid ] = useState(false);
    const [ config, setConfig ] = useState({});
    const [ errorMsg, setErrorMsg ] = useState([]);
    const [ userExist, setUserExist ] = useState(false);
    const [ displayAlertMessage, setDisplayAlertMessage ] = useState(false);

    useEffect(() => {
        (async () => {
            const configResponse = await getConfig();
            if (configResponse.status === 200) {
                setConfig(configResponse.data.data);
            }
        })();
    }, []);

    const tabs = [
        {label: 'User Registration'},
        {label: 'Payment'}
    ];

    const updateErrorMsg = msg => errorMsg.push(msg);


    const validate = () => {
        let errors = {};

        if (!username) {
            errors.name = 'Name is required.';
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

    const dialogFooter = <div><Button label="OK" className="p-button-text" autoFocus onClick={() => isRegistered ? history.push('/login') : setShowMessage(false) } /></div>;

    const infoFooter = <div><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowInfo(false) } /></div>;

    const alertFooter = <div><Button label="OK" className="p-button-text" autoFocus onClick={() => setDisplayAlertMessage(false) } /></div>;

    const ageRange = () => {
        return {
            min: 0,
            max: 99
        };
    };

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
                password,
                age
            }
        };
        if (isPaid && validEmail(email) && validPhone(phone)) {
            const response = await register(data);
            if (response.status === 201) {
                reset();
                setIsRegistered(true);
                setErrorMsg([]);
            } else {
                setIsRegistered(false);
                setErrorMsg([response.data.error])
            }
        } else {
            setIsRegistered(false);
            setErrorMsg([]);
        }
        setShowMessage(true);
        setIsPaid(false);
    };

    const reset = () => {
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setAge();
        setTeam('')
    };

    const onValidation = () => {

        if (username !== '' && firstName !== '' && lastName !== '' && validEmail(email) && validPhone(phone) && (age > 0 && age < 100) && team !== '')
            return true;
        else {
            return false;
        }
    }

    const displayErrorMsg = () => {

        if (step === 'User Registration') {
            if (errorMsg.length !== 0)
                setErrorMsg([]);

            if (username === '')
                updateErrorMsg('Username is required')

            if (firstName === '')
                updateErrorMsg('First Name is required');

            if (lastName === '')
                updateErrorMsg('Last Name is required');

            if (email === '')
                updateErrorMsg('Email is required');
            else if (!validEmail(email))
                updateErrorMsg('Incorrect Email format');

            if (phone === '')
                updateErrorMsg('Phone is required');
            else if (!validPhone(phone))
                updateErrorMsg('Incorrect Phone format');

            if (!age)
                updateErrorMsg('Age is required');
            else if (age < 0 || age > 100)
                updateErrorMsg('Age can only be from 1 to 99');

            if (password === '')
                updateErrorMsg('Password is required');

            if (team === '')
                updateErrorMsg('Team is required');

            if (userExist)
                updateErrorMsg('User ID exist, please try a different User ID');
        } else {
            if (!isPaid) {
                updateErrorMsg('Payment is required');
            }
        }

        const error = [];
        errorMsg.forEach(err => error.push(<li>{ err }</li>));

        return (
            <ul>{ error }</ul>
        )

    }


    const getIndex = () => {
        return tabs.findIndex((element, index) => {
            if (element.label === step) {
                return true;
            }
        })
    }

    const proccedToPayment = async ()  => {
        if (onValidation()) {
            const response = await getUserID(username);
            if (response.status === 200) {
                setUserExist(true);
                setShowMessage(true);
            } else {
                setUserExist(false);
                setShowMessage(false);
                setStep('Payment');
            }
        } else {
            setShowMessage(true);
        }
        setErrorMsg([]);
    }

    const resetUser = () => {
        setUserExist(false);
        setShowMessage(false);
    }


    return (
        <div className={classes.container}>
            <div>
                <Steps model={tabs} activeIndex={ getIndex() } />
            </div>
            <Dialog visible={displayAlertMessage} onHide={() => setDisplayAlertMessage(false) } position="top" footer={alertFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    <h5>Submission Alert</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                    Please Click the Submit button to register
                    </p>
                </div>
            </Dialog>
            <Dialog visible={showInfo} onHide={() => setShowInfo(false) } position="top" footer={infoFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    <h5>Detroit Walkathon INFO</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                    VT Seva Detroit Youth Board's 1st Walkathon By participating in our 1st ever Walkathon, we can be healthy and support 2 causes. All the proceeds goes towards COVID-19 Relief Activities in India and Angels of Hope, MI. Our Bharath needs our support more than ever for the COVID-19 relief activities. When cancer becomes a part of one's life, there is a lot to worry about. Angels of Hope provides financial assistance to the Michigan families in need to ease the burden caused by the disease. Please register and support
                    </p>
                </div>
            </Dialog>
            <Dialog visible={showMessage} onHide={() => isRegistered ? history.push('/login') : resetUser() } position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    { displayIcon() }
                    <h5>{ isRegistered ? 'Successfully Registered' : 'Registration Failed' }</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        { isRegistered ? 'You have been registered' : displayErrorMsg() }
                    </p>
                </div>
            </Dialog>
            <Card  title='REGISTER'>
                <Form onSubmit={onSubmit} validate={ validate } render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        { step === 'User Registration' ?
                        <div>
                            <FormField
                                type='INPUT'
                                name='firstName'
                                label='First Name'
                                value={ firstName }
                                setValue={ setFirstName }
                                autoFocus={ true }
                            />
                            <FormField
                                type='INPUT'
                                name='lastName'
                                label='Last Name'
                                value={ lastName }
                                setValue={ setLastName }
                                autoFocus={ false }
                            />
                            <FormField
                                type='INPUT'
                                name='username'
                                label='Username'
                                value={ username }
                                setValue={ setUsername }
                                autoFocus={ false }
                            />
                            <Message severity="warn" text={`Username is Case Senistive`} />
                            <FormField
                                type='PASSWORD'
                                name='password'
                                label='Password'
                                value={ password }
                                setValue={ setPassword }
                                autoFocus={ false }
                            />
                            <FormField
                                type='INPUT'
                                name='email'
                                label='Email'
                                value={ email }
                                setValue={ setEmail }
                                autoFocus={ false }
                            />
                            <FormField
                                type='INPUT'
                                name='phone'
                                label='Phone'
                                value={ phone }
                                setValue={ setPhone }
                                autoFocus={ false }
                            />
                            <FormField
                                type='NUMBER'
                                name='age'
                                label='Age'
                                value={ age }
                                setValue={ setAge }
                                data={ ageRange() }
                                autoFocus={ false }
                            />
                            <FormField
                                type='DROPDOWN'
                                name='team'
                                label='Team'
                                value={ team }
                                setValue={ setTeam }
                                data={config.team}
                            />
                            <br/>
                            <Button type="button" label="Proceed to Payment" onClick={ () => proccedToPayment() } className="p-mt-2" />
                        </div>
                        :
                         <div id={ classes.payment }>
                            <PayPal setPaid={ setIsPaid } setAlertMessage={ setDisplayAlertMessage }/>
                            <Message severity="warn" text='When you click "PayPal" button you will be taken to PayPal page for completing the payment. You may sign in to your PayPal account(if you have one) or use the option "Credit/Debit Card Payment". When you complete the payment, PayPal will send you a payment confirmation email. Please save the email for your records. Before clicking Submit button, payment must been completed."' style={{ 'width': '300px' }}/>
                            <Button type="submit" label="Submit" onSubmit={ () => onSubmit() } className="p-mt-2" />
                        </div>
                }
                    </form>
                )} />
            </Card>
        </div>
    )
}