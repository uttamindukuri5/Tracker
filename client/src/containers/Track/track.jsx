import React, { useState, useEffect, useRef } from 'react';

import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import { Table } from '../../components/Table/table';

import { registerTrack, getUserHistory, getConfig } from '../../api/endpoint';

import classes from './track.module.css';

export const Track = () => {
    const
        today = new Date(),
        messages = useRef(null);

    const [ date, setDate ] = useState(today);
    const [ track, setTrack ] = useState();
    const [ totalTrack, setTotalTrack ] = useState(0);
    const [ data, setData ] = useState([]);
    const [ config, setConfig ] = useState({});


    const viewUserHistory = async () => {
        const response = await getUserHistory();
        if (response.status === 200) {
            setData(formatData(response.data.data.history));
            setTotalTrack(response.data.data.totalTrack);
        }
    };

    const formatData = data => {
        const updateData = [];
        data.forEach(track => {
            const date = new Date(track.date);
            updateData.push({
                date: `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() }`,
                track: track.counter
            });
        });
        return updateData;
    }

    useEffect(() => {
        (async () => {
            await viewUserHistory();
            const configResponse = await getConfig();
            if (configResponse.status === 200) {
                setConfig(configResponse.data.data);
            }
        })();
    }, [setData, setTotalTrack]);

    const submit = async () => {
        if (track) {
            const trackData = {
                track: {
                    date,
                    count: track
                }
            };

            if (track < 0 || track > 10000) {
                //@ts-ignore
                messages.current.show({ severity: 'error', detail: 'Please enter a chants between 1 to 100 repetitions' });
                return;
            }

            if (!dateValidation()) {
                return;
            }

            const response = await registerTrack(trackData);
            if (response.status === 201) {
                messages.current.show({ severity: 'success', detail: 'Your repetition have been successfully saved' });
                reset();
                await viewUserHistory();
            } else {
                messages.current.show({ severity: 'error', detail: 'Something has gone wrong' });
            }
        } else {
            //@ts-ignore
            messages.current.show({ severity: 'error', detail: 'Please enter a chants between 1 to 100000 steps' });
            return;
        }
    };

    const dateValidation = () => {
        const startDate = new Date(config.date.start * 1000);
        const endDate = new Date(config.date.end * 1000);
        if (date < startDate) {
            //@ts-ignore
            messages.current.show({ severity: 'error', detail: 'Cannot enter dates before January. 21th..' });
            return false;
        } else if (date > today) {
            //@ts-ignore
            messages.current.show({ severity: 'error', detail: 'Cannot enter future date.' });
            return false;
        } else if (date > endDate) {
            //@ts-ignore
            messages.current.show({ severity: 'error', detail: 'Walkathon has ended.' });
            return false;
        }
        return true;
    }

    const reset = () => {
        setDate();
        setTrack();
    }

    return (
        <div>
            <div id={ classes.form }>
                <div className={ classes.section }>
                    <div>
                        <label className={ classes.text }><strong>Date: </strong></label>
                    </div>
                    <div className={ classes.formInput }>
                        <Calendar
                            value={date}
                            onChange={(e) => setDate(e.value) }
                            minDate={ config.date ? new Date(config.date.start * 1000) : today }
                            maxDate={ config.date ? new Date(config.date.end * 1000) : today }
                            style={{ width: 'inherit' }}
                        ></Calendar>
                    </div>
                </div>
                <div className={ classes.section }>
                    <div>
                        <label className={ classes.text }><strong>Steps: </strong></label>
                    </div>
                    <div className={ classes.formInput }>
                        <InputNumber
                            value={ track }
                            onValueChange={ (e) => setTrack(e.value) }
                            style={{ width: 'inherit' }}
                        />
                    </div>
                </div>
                <div>
                    <Messages ref={ messages }/>
                </div>
                <div id={ classes.submitButton }>
                    <Button label='Enter Repetitions' className='p-button-success' onClick={ submit }/>
                </div>
            </div>
            <div className={classes.info}>
                <h4>Total Steps</h4>
                <h2 className={ classes.heading }>{ totalTrack }</h2>
            </div>
            <div className={ classes.data }>
                <Table data={ data } viewTeam={ false } />
            </div>
        </div>
    );
}