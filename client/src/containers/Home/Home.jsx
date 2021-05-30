import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { SelectButton } from 'primereact/selectbutton';

import { Leaderboard } from '../Leaderboard/leaderboard';
import { Track } from '../Track/track';

import { Stats } from '../../components/Stats/stats';
import { Table } from '../../components/Table/table';

import { getTeamStat, getAllUser } from '../../api/endpoint';
import { getToken } from '../../config/token';

import classes from './home.module.css';

export const Home = () => {
    const tabs = ['Dashboard', 'Leaderboard', 'Track'];
    const history = useHistory();

    const [ currentTab, setCurrentTab ] = useState('Dashboard');
    const [ teams, setTeams ] = useState({});
    const [ participants, setParticipants ] = useState(0);
    const [ totalTrack, setTotalTrack ] = useState(0);

    useEffect(() => {
        (async() => {
            if (getToken()) {
                const teamResponse = await getTeamStat();
                const userResponse = await getAllUser();

                if (teamResponse.status === 200) {
                    setTotalTrack(calculateTotalTracks(teamResponse.data.data));
                    setTeams(teamResponse.data.data);
                }

                if (userResponse.status === 200) {
                    setParticipants(userResponse.data.data.length);
                }
            } else
                history.push('/login');
        })();
    }, [ setTotalTrack, setTeams ]);

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
                                stat={40000}
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
                                stat={31}
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

