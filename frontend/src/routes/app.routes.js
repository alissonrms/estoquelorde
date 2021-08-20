import React from "react";
import { Route, Switch } from "react-router-dom";

import BankStatement from "../containers/BankStatement";
import Sale from "../containers/Sale";
import Expense from "../containers/Expense";
import ProductEntry from "../containers/ProductEntry";
import Home from "../containers/Home";

import ResellerList from "../containers/Reseller/list";
import NewReseller from "../containers/Reseller/new";

import Stock from "../containers/Stock";
import NewProduct from "../containers/Stock/newProduct";

export default function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/extrato" exact component={BankStatement} />
      <Route path="/nova/venda" exact component={Sale} />
      <Route path="/nova/despesa" exact component={Expense} />
      <Route path="/nova/entrada-produto" exact component={ProductEntry} />

      <Route path="/representantes" exact component={ResellerList} />
      <Route path="/novo/representante" exact component={NewReseller} />

      <Route path="/estoque" exact component={Stock} />
      <Route path="/novo/produto" exact component={NewProduct} />
    </Switch>
  );
}
