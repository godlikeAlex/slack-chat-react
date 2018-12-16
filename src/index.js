import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './components/app/App';
import {Login, Register} from './components/auth';
import 'semantic-ui-css/semantic.min.css'

const Root = ()=>{
  return (
      <Router>
          <Switch>
              <Route exact path="/" component={App}/>
              <Route  path="/login" component={Login}/>
              <Route  path="/register" component={Register}/>
          </Switch>
      </Router>
  )
};

ReactDOM.render(<Root />, document.getElementById('root'));
