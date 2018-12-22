import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import App from './components/app/App';
import {Login, Register} from './components/auth';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';
import Spinner from './components/spinner';

// Redux Dependencies
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from  'redux-devtools-extension';
import rootReducer  from './reducers';
import {setUser} from './actions';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component{
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                console.log(this.props.setUser);
                this.props.setUser(user);
                this.props.history.push('/');
            }
        });
    }

    render() {
        return this.props.isLoading ? <Spinner /> : (
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route  path="/login" component={Login}/>
                    <Route  path="/register" component={Register}/>
                </Switch>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.user.isLoading
    }
};

const RootWithAuth = withRouter(connect(mapStateToProps,  {setUser} )(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>, document.getElementById('root'));
