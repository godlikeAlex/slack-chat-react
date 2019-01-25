import React from 'react';
import {Grid, Header, Icon, Dropdown, Image, Modal, Input, Button} from 'semantic-ui-react';
import AvatarEditor  from 'react-avatar-editor';
import firebase from '../../firebase';

class UserPanel extends React.Component {

   state = {
       user: this.props.currentUser,
       modal: false,
       verify: false,
       previewImage: '',
       croppedImage: '',
       uploadedCroppedImage: '',
       blob: '',
       storageRef: firebase.storage().ref(),
       userRef: firebase.auth().currentUser,
       usersRef: firebase.database().ref('users'),
       metadata: {
           contentType: 'image/jpeg'
       }
   };

   componentDidMount() {
       this.state.usersRef
           .child(this.state.user.uid)
           .on('value', snap => {
               this.setState({verify: snap.val().verify});
           })
   }

    openModal = ()=> this.setState({modal: true});

   closeModal = ()=> this.setState({modal: false});

   handleChange = event => {
       const file = event.target.files[0];
       const reader = new FileReader();
        if(file){
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result })
            });
        }

   };

   handleCropImage = () => {
       if(this.avatarEditor){
           this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
               let imageUrl = URL.createObjectURL(blob);
               this.setState({
                   croppedImage: imageUrl,
                   blob
               })
           })
       }
   };

    uploadCroppedImage = () => {
       const { storageRef, userRef, blob, metadata } = this.state;

       storageRef
           .child(`avatars/user-${userRef.uid}`)
           .put(blob, metadata)
           .then(snap => {
               snap.ref.getDownloadURL().then(downloadURL => {
                   this.setState({uploadedCroppedImage: downloadURL}, ()=>
                   this.changeAvatar())
               })
           })
    };

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('Photo Uploaded');
                this.closeModal()
            })
            .catch(err => console.error(err));

        this.state.usersRef
            .child(this.state.user.uid)
            .update({avatar: this.state.uploadedCroppedImage})
            .then(() => console.log('User Avatar changed'))
            .catch(err => console.error(err))
    };

   dropdownOptions = () => [
      {
          key: 'user',
          text:
          <span>
              Signed in as
              {
                  this.state.user.displayName === null
                  ?
                  'unknown' : this.state.user.displayName
              }
          </span>,
          disabled: true
      },
      {
          key: 'avatar',
          text: <span onClick={this.openModal}>Change Avatar</span>,
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
      const { user, modal, previewImage, croppedImage } = this.state;
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
                              {user.displayName === null ?
                                  'unknown' :
                                  <span>
                                      {user.displayName}
                                      {this.state.verify
                                          ?
                                      <img src="https://firebasestorage.googleapis.com/v0/b/react-slack-black.appspot.com/o/verify%2Fverify.png?alt=media&token=2fed03cc-fbaf-4fe6-8c7e-b0224b868ac4" alt="verify user" style={{width: '15px', height: '15px'}}/>
                                          : ''} </span>}
                          </span>} options={this.dropdownOptions()} />
                  </Header>
                  <Modal basic onClose={this.closeModal} open={modal}  >
                      <Modal.Header>Change Avatar</Modal.Header>
                      <Modal.Content>
                          <Input
                            fluid
                            onChange={this.handleChange}
                            type='file'
                            label="New Avatar"
                            name="previewImage"
                          />
                          <Grid centred stackable columns={2}>
                              <Grid.Row centerd >
                                  <Grid.Column className="ui center aligned grid" >
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => this.avatarEditor = node}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1}
                                            />
                                        )}
                                  </Grid.Column>
                                  <Grid.Column>
                                      {croppedImage && (
                                          <Image
                                              src={croppedImage}
                                              width={100}
                                              height={100}
                                              style={{margin:'3.5em auto'}}
                                          />
                                      )}
                                  </Grid.Column>
                              </Grid.Row>
                          </Grid>

                      </Modal.Content>
                      <Modal.Actions>
                          {croppedImage && <Button inverted color="green" onClick={this.uploadCroppedImage}>
                              <Icon name="checkmark" /> Change avatar
                          </Button>}
                          <Button inverted color="green" onClick={this.handleCropImage}>
                              <Icon name="image" /> Preview
                          </Button>
                          <Button inverted color="red" onClick={this.closeModal}>
                              <Icon name="remove" /> Discard Change
                          </Button>
                      </Modal.Actions>
                  </Modal>
              </Grid.Column>
          </Grid>
      )
  }
}

export default UserPanel;