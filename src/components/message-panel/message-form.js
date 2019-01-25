import React, {Component} from 'react';
import firebase from '../../firebase';
import uuidv4 from 'uuid/v4';
import {Segment, Button, Input} from 'semantic-ui-react';
import {Picker, emojiIndex} from 'emoji-mart';
import FileModal from './FileModal';
import ProgressBar from "./Progres-bar";

import 'emoji-mart/css/emoji-mart.css';

class MessageForm extends Component{
    state = {
        storageRef: firebase.storage().ref(),
        percentUpload: 0,
        typingRef: firebase.database().ref('typing'),
        uploadState: '',
        uploadTask: null,
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        emojiPicker: false
    };

    componentWillUnmount() {
        if(this.state.uploadTask !== null) {
            this.state.uploadTask.cancel();
            this.setState({uploadTask: null});
        }
    }

    openModal = () => this.setState({ modal: true  });

    closeModal = () => this.setState({ modal: false });

    handlerChange = event => {
      this.setState({[event.target.name]: event.target.value})
    };

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        };

        if(fileUrl !== null) {
            message['image'] = fileUrl
        }else{
            message['content'] = this.state.message
        }
        return message;
    };

    sendMessage = () => {
      const {getMessagesRef} = this.props;
        const {message, channel, user, typingRef} = this.state;
      if(message){
          this.setState({loading:true});
          getMessagesRef()
              .child(channel.id)
              .push()
              .set(this.createMessage())
              .then(()=>{
                  this.setState({loading:false, message: '', errors: []});
                  typingRef
                      .child(channel.id)
                      .child(user.uid)
                      .remove()
              })
              .catch(err=>{
                  console.log(err);
                  this.setState({loading:false, err: this.state.errors.concat(err)})
              })
      }else{
          this.setState({errors: this.state.errors.concat('Add the message')})
      }
    };

    getPath = () => {
        if(this.props.isPrivateChannel){
            return `chat/private${this.state.channel.id}`
        }else{
            return 'chat/public';
        }
    };

    uploadFile = (file, metaData) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metaData)
        },
            ()=>{
                this.state.uploadTask.on('state_changed', snap => {
                     const percentUpload =  Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                     this.setState({percentUpload})
                },
                    err => {
                        console.log(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask : null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                             this.sendFileMessage(downloadUrl, ref, pathToUpload)
                        })
                        .catch(err=>{
                                console.log(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadTask : null
                                })
                            })
                    }
                )
            }
         )
    };

    handleKeyDown = event => {
        if(event.ctrlKey && event.keyCode === 13) {
            this.sendMessage();
        }

        const { message, typingRef, channel, user } = this.state;
        if(message){
            typingRef
                .child(channel.id)
                .child(user.uid)
                .set(user.displayName)
        }else{
            typingRef
                .child(channel.id)
                .child(user.uid)
                .remove()
        }
    };

    handleTogglePicker = () => {
        this.setState({emojiPicker: !this.state.emojiPicker})
    };

    handleAddEmoji = emoji => {
         const oldMessage = this.state.message;
         const newMessage = this.colonToUniCode(` ${oldMessage} ${emoji.colons} `);
        this.setState({message: newMessage, emojiPicker: false});
        setTimeout(() => this.messageInputRef.focus(), 0);
    };

    colonToUniCode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x=>{
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if(typeof emoji !== "undefined"){
                let unicode = emoji.native;
                if(typeof unicode !== "undefined"){
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        })
    };

    sendFileMessage = (fileUrl, ref, path) => {
        ref.child(path)
            .push()
            .set(this.createMessage(fileUrl))
            .then(()=>{
                this.setState({uploadState: 'done'})
            })
            .catch(err=>{
                console.log(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    };


    render() {
        const {message, errors, loading, modal, uploadState, percentUpload, emojiPicker } = this.state;
        return (
            <Segment className="messages__form">
                {emojiPicker && (
                    <Picker
                        set="apple"
                        className="emojiPicker"
                        onSelect={this.handleAddEmoji}
                        title="Pick your emoji"
                        emoji="point_up"
                    />
                )}
                <Input
                    fluid
                    name="message"
                    style={{marginBottom:"0.5em"}}
                    onKeyDown={this.handleKeyDown}
                    ref={node => (this.messageInputRef = node)}
                    label={
                        <Button
                            icon={emojiPicker ? 'close' : 'add'}
                            content={emojiPicker ? 'Close' : null}
                            onClick={this.handleTogglePicker}
                        />}
                    value={message}
                    onChange={this.handlerChange}
                    labelPosition="left"
                    className={
                        errors.some(error => error.includes('message')) ? 'error' : ''
                    }
                    placeholder="Write your message" />
                <ProgressBar
                    uploadState={uploadState}
                    percentUpload={percentUpload}
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        disabled={loading}
                        onClick={this.sendMessage}
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit" />
                    <Button
                        color="teal"
                        disabled={uploadState === 'uploading'}
                        content="Upload Media"
                        onClick={this.openModal}
                        labelPosition="right"
                        icon="cloud upload" />
                </Button.Group>
                <FileModal
                    modal={modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}
                />
            </Segment>
        )
    }
}

export default MessageForm;