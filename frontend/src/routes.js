import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './containers/Login';
import Billing from './containers/Billing';

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/faturamento" exact component={Billing} />
      </Switch>
    </BrowserRouter>
  )
}