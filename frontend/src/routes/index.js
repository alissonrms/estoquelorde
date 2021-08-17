import React from "react";
import { BrowserRouter } from "react-router-dom";

import { DefaultContainer } from "../components/DefaultContainer";
import ReactLoading from "react-loading";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { useLoading } from "../contexts/loading";
import { useAuth } from "../contexts/auth";

export default function Routes() {
  const { loading } = useLoading();
  const { signed } = useAuth()

  if (loading) {
    return (
      <DefaultContainer center>
        <ReactLoading
          type="spinningBubbles"
          color="#fff"
          height={"6%"}
          width={"6%"}
        />
      </DefaultContainer>
    );
  }

  return (
    <BrowserRouter>{signed ? <AppRoutes /> : <AuthRoutes />}</BrowserRouter>
  );
}
