import React from 'react';
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions'
import {Menu, Icon, Modal, Form, Input, Button, Label} from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        activeChannel: '',
        channels: [],
        channel: null,
        user: this.props.currentUser,
        channelName: '',
        channelDetails: '',
        messagesRef: firebase.database().ref('messages'),
        notifications: [],
        channelsRef: firebase.database().ref('channels'),
        typingRef: firebase.database().ref('typing'),
        modal: false,
        firstLoad: true
    };

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
      this.state.channelsRef.off();
        this.state.channels.forEach(channel=>{
            this.state.messagesRef.child(channel.id).off();
        })
    };

    addChannel = () => {
        const { user, channelsRef, channelName, channelDetails } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(()=>{
                this.setState({channelName: '', channelDetails: ''});
                this.closeModal();
                console.log('channel was created');
            })
            .catch(err=>{
                console.log(err);
            });
    };

    addListeners = () =>{
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({channels: loadedChannels}, () => this.setFirstChannel());
            this.addNotificationListener(snap.key);
        })
    };

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap=>{
           if(this.state.channel){
               this.handlerNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
           }
        })
    };

    handlerNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if(index !== -1){
            if(channelId !== currentChannelId){
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0){
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnowTotal = snap.numChildren();
        }else{
            notifications.push({
               id: channelId,
               total: snap.numChildren(),
               lastKnowTotal: snap.numChildren(),
               count: 0
            });
        }

        this.setState({notifications});
    };

    setFirstChannel(){
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0){
            this.props.setCurrentChannel(firstChannel);
            this.activeChannel(firstChannel);
            this.setState({channel: firstChannel});
        }
        this.setState({firstLoad: false})
    };

    closeModal = () => this.setState({modal:false});

    openModal = () => this.setState({modal:true});

    handlerSubmit = event => {
        event.preventDefault();
        if(this.formIsValid(this.state)){
            this.addChannel();
        }
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    };

    changeChannel = channel =>{
        this.activeChannel(channel);
        this.clearNotifications();
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({channel});
    };

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if(index !== -1){
            let updateNotifications = [...this.state.notifications];
            updateNotifications[index].total = this.state.notifications[index].lastKnowTotal;
            updateNotifications[index].count = 0;

            this.setState({notifications: updateNotifications});
        }


        console.log(index);
    };

    activeChannel = channel => {
      this.setState({activeChannel: channel.id});
    };

    getNotificationCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id){
                count = notification.count;
            }
        });


        if(count > 0) return count;
    };

    displayChannels = channels =>
        channels.length > 0 &&
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel) }
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                {this.getNotificationCount(channel) && (
                    <Label color="red">{this.getNotificationCount(channel)}</Label>
                )}
                # {channel.name}
            </Menu.Item>
        ));

    // Validators
    formIsValid({channelName, channelDetails}){
        return channelName && channelDetails;
    }

    render() {
        const {channels, modal, channelName, channelDetails} = this.state;
        const inlineStyle = {
            modal : {
                marginTop: '0px !important',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                alignItems: 'center'
            }
        };

        return (
            <React.Fragment>
                <Menu.Menu style={{paddingBottom: '1.5em'}}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> Channels
                        </span>
                        ({channels.length}) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal} style={inlineStyle.modal}>
                    <Modal.Header>Add a channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handlerSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label = "Name of channel"
                                    value={channelName}
                                    name = "channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label = "About of channel"
                                    value={channelDetails}
                                    name = "channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handlerSubmit}>
                            <Icon name="checkmark"/> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Channels);