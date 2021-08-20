import React from "react";
import Colors from "../../constants/Colors";

import { Card } from "../../components/Card";
import {
  Container,
  ProductContainer,
  ProductName,
  QuantityContainer,
  QuantityControlButton,
  QuantityInput,
} from "./styles";
import Navbar from "../../components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../contexts/auth";
import { PageTitle } from "../Stock/newProduct/styles";

function Sale() {
  const { signOut } = useAuth();

  function logOut(event) {
    event.preventDefault();
    signOut();
  }

  return (
    <>
      <Container>
        <PageTitle>Cadastrar Venda</PageTitle>
        <Card>
          <ProductContainer>

            <ProductName>Banaa</ProductName>

            <QuantityContainer>
              <QuantityControlButton>
                <FontAwesomeIcon
                  icon={faMinusSquare}
                  size="2x"
                  color={Colors.red}
                />
              </QuantityControlButton>

              <QuantityInput></QuantityInput>

              <QuantityControlButton>
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  size="2x"
                  color={Colors.green}
                />
              </QuantityControlButton>
            </QuantityContainer>
            
          </ProductContainer>
        </Card>
        <Card>
          <ProductContainer>

            <ProductName>asdfasdfasdfasdfasdfsd</ProductName>

            <QuantityContainer>
              <QuantityControlButton>
                <FontAwesomeIcon
                  icon={faMinusSquare}
                  size="2x"
                  color={Colors.red}
                />
              </QuantityControlButton>

              <QuantityInput></QuantityInput>

              <QuantityControlButton>
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  size="2x"
                  color={Colors.green}
                />
              </QuantityControlButton>
            </QuantityContainer>

          </ProductContainer>
        </Card>
        <button onClick={logOut}>LogOut</button>
      </Container>

      <Navbar />
    </>
  );
}

export default Sale;
