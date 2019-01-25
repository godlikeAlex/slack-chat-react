import React from 'react';
import {connect} from 'react-redux';
import {setUserPosts} from '../../actions';
import {Segment, Comment} from 'semantic-ui-react';
import MessagesHeader from './messages-header';
import MessageForm from './message-form';
import firebase from '../../firebase';
import Message from './Message';
import Skeleton from './Sekeleton';

import Typing from './typing';

class MessagePanel extends React.Component{
    state = {
        isPrivateChannel: this.props.isPrivateChannel,
        messagesRef: firebase.database().ref('messages'),
        privateMessageRef: firebase.database().ref('privateMessages'),
        usersRef : firebase.database().ref('users'),
        messages: [],
        messagesLoading: true,
        user: this.props.currentUser,
        isStaredChannel : false,
        channel: this.props.currentChannel,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        typingRef: firebase.database().ref('typing'),
        connectedRef:firebase.database().ref('info/connected'),
        typingUsers: [],
        listeners: []
    };

    componentDidMount() {
        const { channel, user, listeners } = this.state;
        if(channel && user) {
            this.removeListeners(listeners)
            this.addListeners(channel.id);
            this.addUserListener(channel.id, user.uid)
        }
    }

    componentWillUnmount() {
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.messagesEnd){
            this.scrollToBottom();
        }
    }

    removeListeners = listeners => {
        listeners.forEach(listener=>{
            listener.ref.child(listener.id).off(listener.event);
        })
    };

    addToListeners = (id, ref, event) => {
        const index = this.state.listeners.findIndex(listener => {
            return listener.id === id && listener.ref === ref && listener.event === event;
        });

        if(index === -1) {
            const newListener = {id, ref, event};
            this.setState({listeners: this.state.listeners.concat(newListener)})
        }
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: 'smooth'});
    };

    addListeners = channelId => {
      this.addMessageListener(channelId);
      this.addTypingListeners(channelId);
    };

    addTypingListeners = channelId => {
        let typingUsers = [];
        this.state.typingRef.child(channelId).on('child_added', snap=>{
            if(snap.key !== this.state.user.uid){
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                });
                this.setState({typingUsers})
            }
        });
        this.addToListeners(channelId, this.state.typingRef, 'child_added');

        this.state.typingRef.child(channelId).on('child_removed', snap => {
            const index = typingUsers.findIndex(user => user.id === snap.key);

            if(index !== -1){
                typingUsers = typingUsers.filter(user => user.id !== snap.key);
                this.setState({typingUsers});
            }
        });
        this.addToListeners(channelId, this.state.typingRef, 'child_removed');

        this.state.connectedRef.on('value', snap=>{
            if(snap.val() === true){
                this.state.typingRef
                    .child(channelId)
                    .child(this.state.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if(err !== null){
                            console.error(err);
                        }
                    });
            }
        })
    };

    addUserListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if(data.val() !== null){
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isStaredChannel: prevStarred });
                }
            })
    };

    handlerSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        },() => this.handlerSearchMessages());
    };

    getMessagesRef = () => {
        const { messagesRef, privateMessageRef, isPrivateChannel  } = this.state;

        return isPrivateChannel ? privateMessageRef : messagesRef;
    };

    handlerSearchMessages = ()=>{
      const channelMessages = [...this.state.messages];
      const regex = new RegExp(this.state.searchTerm, 'gi');
      const searchResults = channelMessages.reduce((acc, message)=> {
          if(message.content &&  message.content.match(regex)){
              acc.push(message);
          }
          return acc;
      }, []);

      this.setState({searchResults})
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
            this.countUserPosts(loadedMessages);
        });

        this.addToListeners(channelId, ref, 'child_added');
    };

    handleStar = () => {
        this.setState(prevState => ({
            isStaredChannel: !prevState.isStaredChannel
        }), () => this.starChannel());
    };

    starChannel = () => {
        if(this.state.isStaredChannel){
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id] : {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                });
        }else{
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if(err !== null){
                        console.log(err)
                    }
                })
        }
    };

    countUniqueUsers = messages => {
      const uniqueUsers = messages.reduce((acc, message) => {
          if(!acc.includes(message.user.name)){
              acc.push(message.user.name)
          }
          return acc;
      }, [] );

      const numUniqueUsers = `${uniqueUsers.length} users`;
      this.setState({numUniqueUsers});
    };

    countUserPosts = messages => {
         let userPosts = messages.reduce((acc, message) => {
             if(message.user.name in acc){
                 acc[message.user.name].count += 1;
             }else{
                 acc[message.user.name] = {
                     avatar: message.user.avatar,
                     count: 1
                 }
             }

             return acc;
         }, {});
        this.props.setUserPosts(userPosts);
    };

    displayMessages = messages =>
      messages.length > 0 &&
      messages.map(message => (
           <Message
                key={message.timeStamp}
                message={message}
                user={this.state.user}/>
      ));

    displayChannelName = channel => {
        return channel ? `${this.state.isPrivateChannel ? '@' : '#'}${channel.name}` : '';
    };

    displayTypingUser = users => (
         users.length > 0 && users.map(user=>(
             <div style={{display: 'flex', alignItems: 'center', marginBottom:'0.2em'}} key={user.id}>
                 <span className="user_typing">{user.name} is typing <Typing /></span>
             </div>
         ))
    );

    displayMessagesSkeleton = loading => (
        loading ? (
            <React.Fragment>
                {[...Array(10)].map((_, i)=>(
                    <Skeleton key={i} />
                ))}
            </React.Fragment>
        ) : null
    );

    render() {
        const {messagesRef, isStaredChannel , channel, messages, user, numUniqueUsers, searchTerm,
            searchResults, isPrivateChannel, typingUsers, messagesLoading} = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handlerSearchChange={this.handlerSearchChange}
                    isPrivateChannel={isPrivateChannel}
                    isStaredChannel={isStaredChannel}
                    handleStar={this.handleStar}
                />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessagesSkeleton(messagesLoading)}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                        {this.displayTypingUser(typingUsers)}
                        <div ref={node => (this.messagesEnd = node)}> </div>
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={isPrivateChannel}
                    getMessagesRef={this.getMessagesRef}/>
            </React.Fragment>
        );
    }
}

export default connect(null, { setUserPosts })(MessagePanel);