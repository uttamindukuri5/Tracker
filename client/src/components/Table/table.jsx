import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import classes from './table.module.css'


export const Table = ({ data, viewTeam }) => {
    const createTable = () => {
        return viewTeam ?
            (
                <DataTable value={ data } sortField={ viewTeam ? 'totalTrack' : 'date' } sortOrder={ -1 }>
                    <Column field={ viewTeam ? 'teamName' : 'date' } header={ viewTeam ? 'Team' : 'Date' } />
                    <Column field='participants' header='Participant' bodyStyle={{ width: '100%', textAlign: 'center' }} />
                    <Column field={ viewTeam ? 'totalTrack' : 'counter' } header="Steps" bodyStyle={{ width: '100%', textAlign: 'right' }} />
                </DataTable>
            )
        :
            (
                <DataTable value={data} sortField={ viewTeam ? 'totalTrack' : 'date' } sortOrder={ -1 } >
                    <Column field={viewTeam ? 'teamName' : 'date' } header={ viewTeam ? 'Team' : 'Date' } />
                    <Column field={viewTeam ? 'totalTrack' : 'track'} header="Steps" bodyStyle={{ width: '100%', textAlign: 'right' }} />
                </DataTable>
            );
    };

    return (
        <div id={ classes.container }>
            { createTable() }
        </div>
    )
}