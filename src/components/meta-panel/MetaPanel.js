import React, {Component} from 'react';
import {Segment, Accordion, Icon, Header, Image, List } from 'semantic-ui-react';

class MetaPanel extends Component{
  state = {
      currentChannel: this.props.currentChannel,
      privateChannel: this.props.isPrivateChannel,
      activeIndex: 0
  };

   setActiveIndex = (event, titleProps) => {
       const { index } = titleProps;
       const {activeIndex} = this.state;
       const newIndex = activeIndex  === index ? -1 : index;
       this.setState({activeIndex: newIndex});
   };

   formatCount = num => (num > 1 || num === 0 ? `${num} posts` : `${num} post`);

   displayPosters = posts => (
       Object.entries(posts)
           .sort((a, b) => b[1] - a[1])
           .map(([key, val], i)=>(
               <List.Item key={i}>
                    <Image avatar src={val.avatar}/>
                   <List.Content>
                       <List.Header as="a">{key}</List.Header>
                       <List.Description>{this.formatCount(val.count)} posts</List.Description>
                   </List.Content>
               </List.Item>
           ))
   );

  render() {
      const {activeIndex, privateChannel, currentChannel} = this.state;
      const {userPosts} = this.props;

      if( privateChannel ) return null;

      return (
          <Segment loading={!currentChannel}>
              <Header as="h3" style={{padding:'1em'}}>
                {currentChannel && currentChannel.name}
              </Header>
              <Accordion styled>
                  <Accordion.Title
                      active={activeIndex === 0}
                      index={0}
                      onClick={this.setActiveIndex}
                  >
                      <Icon name="dropdown" />
                      <Icon name="info" />
                      Channel Details
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 0}>
                      {currentChannel && currentChannel.details}
                  </Accordion.Content>

                  <Accordion.Title
                      active={activeIndex === 1}
                      index={1}
                      onClick={this.setActiveIndex}
                  >
                      <Icon name="dropdown" />
                      <Icon name="user circle" />
                      Top posters
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 1}>
                      <List>
                          {userPosts && this.displayPosters(userPosts )}
                      </List>
                  </Accordion.Content>

                  <Accordion.Title
                      active={activeIndex === 2}
                      index={2}
                      onClick={this.setActiveIndex}
                  >
                      <Icon name="dropdown" />
                      <Icon name="pencil alternate" />
                      Created By
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 2}>
                      <Image src={currentChannel && currentChannel.createdBy.avatar} />
                      {currentChannel && currentChannel.createdBy.name}
                  </Accordion.Content>
              </Accordion>
          </Segment>
      )
  }
}

export default MetaPanel;