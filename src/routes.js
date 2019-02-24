import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from '././components/Login';
import Home from '././components/Home';

const Routes = () => (
  <BrowserRouter>
      <Switch>
          {/* Base path - http://localhost:3000/*/}
          <Route exact path="/" component={Login}/>
          {/* After succesful login, redirect to - http://localhost:3000/home */}
          <Route path="/home" component={Home}/>
      </Switch>
  </BrowserRouter>
);

export default Routes;

