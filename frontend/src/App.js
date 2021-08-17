import React from "react";
import { toast } from "react-toastify";

import "./global.css";
import "react-toastify/dist/ReactToastify.css";

import { LoadingProvider } from "./contexts/loading";
import { AuthProvider } from "./contexts/auth";
import Routes from "./routes";

toast.configure();

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
