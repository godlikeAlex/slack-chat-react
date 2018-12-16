import React, {Component} from 'react';
import './style.css';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import firebase from '../../firebase'
import {Link} from 'react-router-dom';

class Register extends Component {
    state = {
        userName: '',
        mail: '',
        password: '',
        passwordConfirmation : '',
        errors: []
    };

    handlerChange = event =>{
      this.setState({[event.target.name]: event.target.value});
    };

    isFormValid = () => {
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state)){
            error = {message: 'Missing required fields'};
            this.setState({errors: errors.concat(error)});
            return false;
        } else if(!this.isPasswordValid(this.state)){
            error = {message: 'Password is invalid'};
            this.setState({errors: errors.concat(error)});
            return false;
        } else {
            return true
        }
    };

    isFormEmpty = ({userName, mail, password, passwordConfirmation})=>{
        return !userName.length || !mail.length || !password.length || !passwordConfirmation.length
    };

    isPasswordValid = ({password, passwordConfirmation})=>{
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false;
        }else if(password !== passwordConfirmation) {
            return false;
        }else{
            return true;
        }
    };

    displayErrors = errors => errors.map((err, i)=> <p className="error" key={i}>{err.message}</p>)

    handlerSubmit = event =>{
        event.preventDefault();
        if(this.isFormValid()){
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.mail, this.state.password)
                .then(createUser =>{
                    console.log(createUser)
                })
                .catch(err =>{
                    console.error(err);
                });
        }
    };

    render() {
        const {userName, mail, password, passwordConfirmation, errors} = this.state;
        return(
            <div className='login-form'>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Icon name="gem piece"  /> Create new account
                        </Header>
                        <Form size='large' onSubmit={this.handlerSubmit}>
                            <Segment stacked>
                                <Form.Input fluid name="userName" value={userName} icon='user' onChange={this.handlerChange} iconPosition='left' placeholder='Username' />
                                <Form.Input fluid name="mail" value={mail} icon='mail' onChange={this.handlerChange} iconPosition='left' placeholder='E-mail address' />
                                <Form.Input
                                    fluid
                                    name="password"
                                    value={password}
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    onChange={this.handlerChange}
                                    type='password'
                                />
                                <Form.Input
                                    fluid
                                    name="passwordConfirmation"
                                    value={passwordConfirmation}
                                    icon='repeat'
                                    iconPosition='left'
                                    onChange={this.handlerChange}
                                    placeholder='Password Confirmation'
                                    type='password'
                                />
                                {errors.length > 0 && (this.displayErrors(errors))}
                                <Button color='teal' fluid size='large'>
                                    Create account
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            New to us? <Link to="/login">Sign Up</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Register;