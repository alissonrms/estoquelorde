import React from "react";

import { Container } from "./styles";
import Navbar from "../../components/Navbar";

import { useAuth } from "../../contexts/auth";

function Sale() {
  const { signOut } = useAuth();

  function logOut(event) {
    event.preventDefault();
    signOut();
  }

  return (
    <>
      <Container>
        <button onClick={logOut}>LogOut</button>
      </Container>

      <Navbar />
    </>
  );
}

export default Sale;
