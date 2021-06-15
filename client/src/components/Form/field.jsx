import React from 'react';
import { Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

import classes from './field.module.css';

export const FormField = ({ type, value, setValue, name, label, data }) => {

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small>{meta.error}</small>;
    };

    const displayField = () => {
        switch (type) {
            case 'INPUT':
                return (
                    <Field name={ name } render={({ input, meta }) => (
                        <div className={ classes.inputField }>
                            <span className='p-float-label'>
                                <InputText id={ name } {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} onChange={ e => setValue(e.target.value) } value={ value }/>
                                <label htmlFor={ name } className={classNames({ 'p-error': isFormFieldValid(meta) })}>{ label }*</label>
                            </span>
                            {getFormErrorMessage(meta)}
                        </div>
                    )} />
                );
            case 'PASSWORD':
                return (
                    <Field name={ name } render={({ input, meta }) => (
                        <div className={ classes.inputField }>
                            <span className='p-float-label'>
                                <Password id={ name } {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} onChange={ e => setValue(e.target.value) } value={ value } toggleMask />
                                <label htmlFor={ name } className={classNames({ 'p-error': isFormFieldValid(meta) })}>{ label }*</label>
                            </span>
                            {getFormErrorMessage(meta)}
                        </div>
                    )} />
                );
            case 'DROPDOWN':
                return (
                    <Field name={ name } render={({ input }) => (
                        <div className={ classes.inputField }>
                            <span className="p-float-label">
                                <Dropdown id={ name } {...input} options={ data } value={ value } onChange={ e => setValue(e.target.value) } />
                                <label htmlFor={ name }>{ label }*</label>
                            </span>
                        </div>
                    )} />
                );
            case 'NUMBER':
                return (
                    <Field name={ name } render={({ input }) => (
                        <div className={ classes.inputField }>
                            <span className="p-float-label">
                                <InputNumber id={ name } {...input} autoFocus min={ data.min } max={ data.max } value={ value } onChange={ e => setValue(e.value) } />
                                <label htmlFor={ name }>{ label }*</label>
                            </span>
                        </div>
                    )} />
                );
            default:
                return;
        }
    }

    return (
        <div>
            { displayField() }
        </div>
    )

}