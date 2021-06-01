import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './containers/Login';
import Billing from './containers/Billing';
import BankStatement from './containers/BankStatement';
import Stock from './containers/Stock';
import Reseller from './containers/Reseller';
import Expense from './containers/Expense';

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/faturamento" exact component={Billing} />
        <Route path="/extrato" exact component={BankStatement} />
        <Route path="/estoque" exact component={Stock} />
        <Route path="/representantes" exact component={Reseller} />
        <Route path="/despesas" exact component={Expense} />
      </Switch>
    </BrowserRouter>
  )
}