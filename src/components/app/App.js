import React, { Component } from 'react';
import './App.css';
import {Grid} from "semantic-ui-react";
import {connect} from 'react-redux';

import ColorPanel from '../color-panel';
import SidePanel from '../side-panel';
import MessagePanel from '../message-panel';
import MetaPanel from '../meta-panel';



class App extends Component {
  render() {
      const {currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor} = this.props;
    return (
        <Grid columns='equal' className='app' style={{background: secondaryColor}}>
                <ColorPanel
                    key={currentUser && currentUser.name}
                    currentUser={currentUser}
                />
                <SidePanel
                    currentUser={currentUser}
                    key={currentUser && currentUser.uid}
                    primaryColor={primaryColor}
                />
            <Grid.Column style={{marginLeft:320}}>
                <MessagePanel
                    currentChannel={currentChannel}
                    currentUser={currentUser}
                    key={currentChannel && currentChannel.id}
                    isPrivateChannel={isPrivateChannel}
                />
            </Grid.Column>
            <Grid.Column width={4}>
                <MetaPanel
                    currentChannel={currentChannel}
                    userPosts={userPosts}
                    key={currentChannel && currentChannel.name}
                    isPrivateChannel={isPrivateChannel}
                />
            </Grid.Column>
        </Grid>
    );
  }
}

const mapStateToProps = state => {
    return {
        currentUser: state.user.currentUser,
        currentChannel: state.channel.currentChannel,
        isPrivateChannel: state.channel.isPrivateChannel,
        userPosts: state.channel.userPosts,
        primaryColor: state.colors.primaryColor,
        secondaryColor: state.colors.secondaryColor
    }
};

export default connect(mapStateToProps)(App);
