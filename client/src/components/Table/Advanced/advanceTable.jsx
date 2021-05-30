import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

import './advanceTable.module.css';

export const AdvanceTable = ({ data, setModal, setUser }) => {

    const nameData = (data) => {
        return (
            <div>
                <Button label={ data.name } className={ 'p-button-raised p-button-secondary p-button-text' } onClick={ () => onDisplayModal(data) }/>
            </div>
        );
    }

    const onDisplayModal = (data) => {
        setUser(data);
        setModal(true);
    };

    return (
        <div>
            <DataTable value={ data } className='p-datatable-responsive-demo' sortField='track' sortOrder={ -1 }>
                <Column body={ nameData } field='name' header='Name' sortable filter filterPlaceholder='Please enter name' filterMatchMode='contains' />
                <Column field='track' header='Steps' bodyStyle={{ width: '100%', textAlign: 'right' }} sortable />
            </DataTable>
        </div>
    );
}