import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { SelectButton } from 'primereact/selectbutton';

import { Leaderboard } from '../Leaderboard/leaderboard';
import { Track } from '../Track/track';

import { Stats } from '../../components/Stats/stats';
import { Table } from '../../components/Table/table';

import { getTeamStat, getAllUser, getConfig } from '../../api/endpoint';

import classes from './home.module.css';

export const Home = () => {
    const tabs = ['Dashboard', 'Leaderboard', 'Track'];
    const history = useHistory();

    const [ currentTab, setCurrentTab ] = useState('Dashboard');
    const [ teams, setTeams ] = useState({});
    const [ participants, setParticipants ] = useState(0);
    const [ totalTrack, setTotalTrack ] = useState(0);
    const [ daysRemaining, setDaysRemaining ] = useState(0);
    const [ config, setConfig ] = useState({});

    useEffect(() => {
        (async() => {
                const teamResponse = await getTeamStat();
                const userResponse = await getAllUser();
                const configResponse = await getConfig();

                if (teamResponse.status === 200) {
                    setTotalTrack(calculateTotalTracks(teamResponse.data.data));
                    setTeams(teamResponse.data.data);
                }

                if (userResponse.status === 200) {
                    setParticipants(userResponse.data.data.length);
                }

                if (configResponse.status === 200) {
                    setConfig(configResponse.data.data);
                    setDaysRemaining(getNumOfDays(configResponse.data.data.date))
                }
        })();
    }, [ setTotalTrack, setTeams, setDaysRemaining, history ]);

    const getNumOfDays = date => {
        const startDate = new Date(date.start * 1000);
        const endDate = new Date(date.end * 1000);

        const day = 1000 * 60 * 60 * 24;
        const diffTime = endDate - startDate;
        return Math.round(diffTime / day);
    }

    const calculateTotalTracks = data => {
        let totalTrack = 0;
        data.forEach(team => totalTrack += team.totalTrack);
        return totalTrack;
    }


    const displayTab = () => {
        switch (currentTab) {
            case 'Dashboard':
                return (
                    <div>
                        <div className='p-d-flex p-jc-center p-flex-column p-flex-md-row'>
                            <Stats
                                title='Total Steps'
                                stat={ totalTrack }
                            />
                            <Stats
                                title='Goal'
                                stat={ config.goal }
                            />
                            <Stats
                                title='Total Participants'
                                stat={ participants }
                            />
                            <Stats
                                title='Remaining Steps'
                                stat={ 40000 - totalTrack }
                            />
                            <Stats
                                title='Remaining Days'
                                stat={ daysRemaining }
                            />
                        </div>
                        <div>
                            <Table data={ teams } viewTeam={ true } />
                        </div>
                    </div>
                );
            case 'Leaderboard':
                return (
                    <div>
                        <Leaderboard />
                    </div>
                );
            case 'Track':
                return (
                    <div>
                        <Track />
                    </div>
                );
            default:
                return;
        }
    }

    return (
        <div id={ classes.container }>
            <div>
                <SelectButton value={ currentTab } options={ tabs } onChange={ e => setCurrentTab(e.value) }></SelectButton>
            </div>
            <div>
                { displayTab() }
            </div>
        </div>
    );
};

