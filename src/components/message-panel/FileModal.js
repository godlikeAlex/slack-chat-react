import React, {Component} from "react";
import mime from 'mime-types';
import {Modal, Button, Icon, Input} from "semantic-ui-react";

class FileModal extends Component {
    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    };

    addFile = event => {
        const file =  event.target.files[0];
        if(file){
            this.setState({file})
        }
    };

    sendFile = () => {
        const { file } = this.state;
        const {uploadFile, closeModal} = this.props;
        if(file !== null){
            if(this.isAuthorized(file.name)){
                const metaData = {contentType: mime.lookup(file.name)};
                uploadFile(file, metaData);
                closeModal();
                this.clearFile();
            }
        }
    };

    clearFile = () => {
        this.setState({file: null});
    };

    isAuthorized = fileName => this.state.authorized.includes(mime.lookup(fileName));

    render() {
        const {closeModal, modal} = this.props;

        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header> Select an Image File </Modal.Header>
                <Modal.Content>
                    <Input
                        onChange={this.addFile}
                        fluid
                        label="File types: jpg, png"
                        name="file"
                        type="file"/>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        onClick={this.sendFile}
                        inverted
                        >
                        <Icon name="checkmark" />Send File
                    </Button>
                    <Button
                        color="red"
                        inverted
                    >
                        <Icon name="remove" />Close modal
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default FileModal;