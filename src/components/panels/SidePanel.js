import React from 'react';
import {Menu} from 'semantic-ui-react';
import UserPanel from './user-panel';

const SidePanel = ()=>{
    return (
        <div>
            <Menu
            size='large'
            inverted
            fixed='left'
            vertical
            style={{background: '#492098'}}>
                <UserPanel />
            </Menu>
        </div>
    )
};

export default SidePanel;