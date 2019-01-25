import React, {Component} from 'react';
import {Header, Segment, Icon, Input} from 'semantic-ui-react';


class MessagesHeader extends Component{

    render() {
        const {
            channelName,
            numUniqueUsers,
            handlerSearchChange,
            isPrivateChannel,
            handleStar,
            isStaredChannel
        } = this.props;
        return (
            <Segment clearing>
                 <Header flui="true" as="h4" floated="left" style={{ marginBottom: 0}} >
                     <span>
                         {channelName}
                         {!isPrivateChannel && (
                             <Icon
                                 onClick={handleStar}
                                 name={isStaredChannel ? 'star' : 'star outline'}
                                 color={isStaredChannel ? 'yellow' : 'black'}
                                 style={{paddingLeft: '5px'}}
                             />
                         )}
                     </span>
                     <Header.Subheader>
                         {!isPrivateChannel ? numUniqueUsers : ''}

                     </Header.Subheader>
                 </Header>
                <Header
                    floated="right"
                >
                    <Input
                        className="message__search"
                        onChange={handlerSearchChange}
                        placeholder="Search a message"
                        icon="search"
                        size="mini"
                        name="searchTerm"
                    />
                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;