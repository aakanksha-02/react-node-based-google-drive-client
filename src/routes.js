import React from 'react';
import {BrowserRouter,  Route, Redirect, Switch} from 'react-router-dom';

import Welcome from '././components/Welcome/Welcome';
import Home from '././components/Home/Home';

const Routes = () => (
  <BrowserRouter >
      <Switch>
          {/* Base path - http://localhost:3000/*/}
          <Route exact path="/" component={Welcome}/>
          {/* After succesful login, redirect to - http://localhost:3000/home */}
          <Route path="/home" component={Home}/>
      </Switch>
  </BrowserRouter>
);

export default Routes;