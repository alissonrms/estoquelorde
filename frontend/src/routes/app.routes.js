import React from "react";
import { Route, Switch } from "react-router-dom";

import BankStatement from "../containers/BankStatement";
import Stock from "../containers/Stock";
import Sale from "../containers/Sale";
import Reseller from "../containers/Reseller";
import Expense from "../containers/Expense";
import ProductEntry from "../containers/ProductEntry";
import Home from "../containers/Home";

export default function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/extrato" exact component={BankStatement} />
      <Route path="/estoque" exact component={Stock} />
      <Route path="/nova/venda" exact component={Sale} />
      <Route path="/nova/despesa" exact component={Expense} />
      <Route path="/nova/entrada-produto" exact component={ProductEntry} />
      <Route path="/novo/representante" exact component={Reseller} />
    </Switch>
  );
}
