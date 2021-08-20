import React, { useState } from "react";

import api from "../../../services/api";

import { Container, PageTitle, ResellerName } from "./styles";
import Navbar from "../../../components/Navbar";
import { Button } from "../../../components/Button";
import { useHistory } from "react-router-dom";

function NewProduct() {
  const history = useHistory();

  const [productName, setProductName] = useState("");

  async function handleCreateProduct() {
    api
      .post("product", {
        name: productName,
      })
      .then((response) => {
        console.log(response.data);
        history.push("/estoque");
      });
  }

  return (
    <>
      <Container>
        <PageTitle>Cadastrando Produto</PageTitle>
        
        <ResellerName
          onChange={(event) => setProductName(event.target.value)}
        />
        <Button onClick={handleCreateProduct}>Cadastrar</Button>
      </Container>

      <Navbar />
    </>
  );
}

export default NewProduct;