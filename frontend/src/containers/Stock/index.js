import React, { useState, useEffect } from "react";

import { showErrorMessage, showSuccessMessage } from "../../services/toastService";

import api from "../../services/api";

import {
  ActionButtonsContainer,
  Container,
  IconButton,
  NewButton,
} from "./styles";
import { Card, HeaderText, ItemsContainer } from "../../components/Card";
import Navbar from "../../components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function Stock() {
  const history = useHistory();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("product", {}).then((response) => {
      setProducts(response.data);
    });
  }, []);

  async function handleDeleteProduct(productId){
    if(window.confirm('Deseja Realmente deletar o Representante')){
      await api
        .delete(`product/${productId}`)
        .then((response) => {
          showSuccessMessage('Produto Removido');
          setProducts(products.filter((product) => product.id !== productId));
        })
        .catch((error) => {
          showErrorMessage(error);
        });
    }
  }

  return (
    <>
      <Container>
        {products.map((product) => (
          <Card>
            <ItemsContainer>
              <HeaderText>{product.name}</HeaderText>
              <ActionButtonsContainer>
                <IconButton onClick={() => alert("Em Produção")}>
                  <FontAwesomeIcon
                    style={{ marginRight: 15 }}
                    icon={faPen}
                    size="1x"
                    color="DodgerBlue"
                  />
                </IconButton>
                <IconButton onClick={() => handleDeleteProduct(product.id)}>
                  <FontAwesomeIcon
                    style={{ marginRight: 15 }}
                    icon={faTrash}
                    size="1x"
                    color="FireBrick"
                  />
                </IconButton>
              </ActionButtonsContainer>
            </ItemsContainer>
          </Card>
        ))}

        <NewButton onClick={() => history.push("/novo/produto")}>
          Novo Produto
        </NewButton>
      </Container>

      <Navbar />
    </>
  );
}

export default Stock;
