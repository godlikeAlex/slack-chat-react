import React, {Component} from 'react';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import firebase from '../../firebase';

class Login extends Component {
    state = {
        mail: '',
        password: '',
        errors : [],
        loading: false
    };

    handlerChange = event => {
        this.setState({ [event.target.name] : event.target.value })
    };

    handlerSubmit = event =>{
        event.preventDefault();
        const {mail, password} = this.state;
        if(this.isFormValid(this.state)){
            this.setState({errors: [], loading: true});
            firebase
                .auth()
                .signInWithEmailAndPassword(mail, password)
                .then(signedUser=>{
                    console.log(signedUser);
                    this.setState({loading: false});
                })
                .catch(err =>{
                    this.setState({errors: this.state.errors.concat(err), loading: false});
                })
        }else{
            this.setState({errors: this.state.errors.concat({message :'Missing require fields'}), loading: false})
        }
    };

    isFormValid = ({mail, password}) => mail && password;

    displayErrors = (errors) => errors.map((err, i)=> <p className="error" key={i}>{err.message}</p>);

    render() {
        const {mail, password, errors, loading} = this.state;
        return(
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}} >
                        <Header as="h2" color="violet" textAlign='center'>
                            <Icon name="sign-in"/> Sign in your account
                        </Header>
                        <Form onSubmit={this.handlerSubmit} size="large">
                            <Segment stacked>
                                <Form.Input
                                    fluid
                                    name="mail"
                                    icon='mail'
                                    value={mail}
                                    iconPosition='left'
                                    placeholder='Password'
                                    onChange={this.handlerChange}
                                />
                                <Form.Input
                                    fluid
                                    name="password"
                                    icon='lock'
                                    value={password}
                                    iconPosition='left'
                                    placeholder='Password'
                                    onChange={this.handlerChange}
                                    type='password'
                                />
                                {errors.length > 0 && (this.displayErrors(errors))}
                                <Button disabled={loading} color="violet" fluid size='large' className={loading ? 'loading' : ''}>
                                    Sign In
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            Create new account <Link to={'/register'}>Sign in</Link>
                        </Message>
                    </Grid.Column>
                </Grid>

        );
    }
}

export default Login;