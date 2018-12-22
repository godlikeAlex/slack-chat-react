import React from 'react';
import {Grid, Header, Icon, Dropdown} from 'semantic-ui-react';

class UserPanel extends React.Component {
  dropdownOptions = () => [
      {
          key: 'user',
          text: <span>Signed in as User</span>,
          disable: true
      },
      {
          key: 'avatar',
          text: <span>Change Avatar</span>,
      },
      {
          key: 'signout',
          text: <span>Sign Out</span>,
      },
  ];

    render() {
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
                      <Dropdown trigger={<span>User</span>} options={this.dropdownOptions()} />
                  </Header>
              </Grid.Column>
          </Grid>
      )
  }
}

export default UserPanel;