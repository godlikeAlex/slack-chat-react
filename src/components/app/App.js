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
    return (
        <Grid columns='equal' className='app' >
                <ColorPanel/>
                <SidePanel currentUser={this.props.currentUser}/>

            <Grid.Column style={{marginLeft:320}}>
                <MessagePanel/>
            </Grid.Column>
            <Grid.Column width={4}>
                <MetaPanel/>
            </Grid.Column>
        </Grid>
    );
  }
}

const mapStateToProps = state => {
    return {
        currentUser: state.user.currentUser
    }
};

export default connect(mapStateToProps)(App);
