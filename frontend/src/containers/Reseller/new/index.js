import React, { useState } from "react";

import api from "../../../services/api";

import { Container, PageTitle, ResellerName } from "./styles";
import Navbar from "../../../components/Navbar";
import { Button } from "../../../components/Button";
import { useHistory } from "react-router-dom";

function NewReseller() {
  const history = useHistory();

  const [resellerName, setResellerName] = useState("");

  async function handleCreateReseller() {
    api
      .post("reseller", {
        reseller_name: resellerName,
      })
      .then((response) => {
        console.log(response.data);
        history.push("/representantes");
      });
  }

  return (
    <>
      <Container>
        <PageTitle>Cadastrando Representante</PageTitle>
        
        <ResellerName
          onChange={(event) => setResellerName(event.target.value)}
        />
        <Button onClick={handleCreateReseller}>Cadastrar</Button>
      </Container>

      <Navbar />
    </>
  );
}

export default NewReseller;
