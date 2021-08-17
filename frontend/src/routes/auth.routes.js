import React from "react";
import { Route, Redirect } from "react-router-dom";

import Login from "../containers/Login";

export default function AuthRoutes() {
  return (
    <>
      <Redirect to="/" />
      <Route path="/" exact component={Login} />
    </>
  );
}
