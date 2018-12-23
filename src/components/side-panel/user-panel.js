import React from 'react';
import {Grid, Header, Icon, Dropdown, Image} from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends React.Component {

   state = {
       user: this.props.currentUser
   };

    dropdownOptions = () => [
      {
          key: 'user',
          text:
          <span>
              Signed in as {this.state.user.displayName === null ? 'unknown' : this.state.user.displayName}
          </span>,
          disabled: true
      },
      {
          key: 'avatar',
          text: <span>Change Avatar</span>,
      },
      {
          key: 'signOut',
          text: <span onClick={this.handleSignOut}>Sign Out</span>,
      },
  ];

  handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(()=> console.log('sign out'))
  };

  render() {
      const { user } = this.state;
      return (
          <Grid style={{padding: '1.2em', margin: 0}}>
              <Grid.Column>
                  <Grid.Row>
                      <Header inverted floated='left' as="h2">
                          {/*App Header*/}
                          <Icon name='code'/>
                          <Header.Content>Developers Chat</Header.Content>
                      </Header>
                  </Grid.Row>

                  {/*User Dropdown */}
                  <Header inverted as="h4" style={{padding: '0.25em'}}>
                      <Dropdown trigger={
                          <span>
                              <Image src={user.photoURL} avatar spaced="right" />
                              {user.displayName === null ? 'unknown' : user.displayName}
                          </span>} options={this.dropdownOptions()} />
                  </Header>
              </Grid.Column>
          </Grid>
      )
  }
}

export default UserPanel;