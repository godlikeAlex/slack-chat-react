import React from 'react';
import {Menu} from 'semantic-ui-react';
import UserPanel from './user-panel';

const SidePanel = ({currentUser})=>{
    return (
        <div>
            <Menu
            size='large'
            inverted
            fixed='left'
            vertical
            style={{background: '#492098'}}>
                <UserPanel currentUser={currentUser} />
            </Menu>
        </div>
    )
};

export default SidePanel;