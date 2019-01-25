import React from 'react';
import {Menu} from 'semantic-ui-react';
import UserPanel from './user-panel';
import Channels from './chanels';
import DirectMessages from './DirectMessages';
import Starred from './stared';

const SidePanel = ({currentUser, primaryColor})=>{
    return (
            <Menu
            size='large'
            inverted
            fixed='left'
            vertical
            style={{background: primaryColor }}>
                <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
                <Starred currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
            </Menu>
    )
};

export default SidePanel;