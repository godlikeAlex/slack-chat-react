import React, { Component } from 'react';
import './App.css';
import {Grid} from "semantic-ui-react";

import {
  ColorPanel,
  MessagePanel,
  MetaPanel,
  SidePanel,
} from '../panels';

class App extends Component {
  render() {
    return (
        <Grid columns='equal' className='app' >
                <ColorPanel/>
                <SidePanel/>

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

export default App;
