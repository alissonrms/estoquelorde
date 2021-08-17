import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { useAuth } from "../../contexts/auth";
import { getFirstAndLastDayOfCurrentMonth, convertNumberToBrlCurrency } from '../../utils/functions';

import { Card, CardHeader, HeaderText, CardContainer, ItemsContainer, CardItem, ItemText } from '../../components/Card';
import { DefaultContainer } from '../../components/DefaultContainer';
import Navbar from '../../components/Navbar';

import Colors from '../../constants/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faBox, faUser } from '@fortawesome/free-solid-svg-icons';


function Home() {
  const { userId } = useAuth();

  const currentMonthDateInterval = getFirstAndLastDayOfCurrentMonth();
  const firstDay = Date.parse(currentMonthDateInterval.firstDay);
  const lastDay = Date.parse(currentMonthDateInterval.lastDay);

  const [statement, setStatement] = useState({});
  const [threeProductsArray, setThreeProductsArray] = useState([]);
  const [threeResellersArray, setThreeResellersArray] = useState([]);

  useEffect(() => {
    api.get('statement-values', {
      headers: {
        id_user: userId
      },
      params: {
        datepast: firstDay,
        today: lastDay
      }
    }).then(response => {
      setStatement(response.data)
    })
  }, [userId, firstDay, lastDay])

  useEffect(() => {
    api.get('product', {
      headers: {
        id_user: userId
      }
    }).then(response => {
      setProductsArray(response.data)
    })
  }, [userId])

  useEffect(() => {
    api.get('reseller', {
      headers: {
        id_user: userId
      }
    }).then(response => {
      setResellersArray(response.data)
    })
  }, [userId])

  function setProductsArray(products) {
    const arrays = [], size = 3;

    while (products.length > 0) {
      arrays.push(products.splice(0, size));
    }

    setThreeProductsArray(arrays);
  }


  function setResellersArray(resellers) {
    const arrays = [], size = 3;

    while (resellers.length > 0) {
      arrays.push(resellers.splice(0, size));
    }

    setThreeResellersArray(arrays);
  }

  return (
    <>
      <DefaultContainer>
        <Card>
          <CardHeader>
            <HeaderText>
              <FontAwesomeIcon style={{ marginRight: 15 }} icon={faDollarSign} size="1x" color="gray" />
              Faturamento do Mês
            </HeaderText>

            <HeaderText>06/2021</HeaderText>
          </CardHeader>

          <CardContainer>
            <CardItem color={Colors.green}>
              <ItemText size="small">Vendas</ItemText>
              <ItemText size="25px" weight="400">{convertNumberToBrlCurrency(statement.sale)}</ItemText>
            </CardItem>

            <ItemsContainer>
              <CardItem color={Colors.red} marginTop>
                <ItemText size="small">Despesas</ItemText>
                <ItemText size="25px" weight="400">{convertNumberToBrlCurrency(statement.expense)}</ItemText>
              </CardItem>

              <CardItem color={Colors.darkBlue} marginTop>
                <ItemText size="small">Entrada de Produtos</ItemText>
                <ItemText size="25px" weight="400">{convertNumberToBrlCurrency(statement.entry_product)}</ItemText>
              </CardItem>
            </ItemsContainer>

            <CardItem color="black" marginTop>
              <ItemText size="medium">Saldo</ItemText>
              <ItemText size="34px" weight="400">{convertNumberToBrlCurrency(statement.sale - statement.expense - statement.entry_product)}</ItemText>
            </CardItem>
          </CardContainer>
        </Card>

        <Card>
          <CardHeader>
            <HeaderText>
              <FontAwesomeIcon style={{ marginRight: 15 }} icon={faBox} size="1x" color="gray" />
              Estoque de Produtos
            </HeaderText>
          </CardHeader>

          <CardContainer>
            {threeProductsArray.map(productsArray => (
              <ItemsContainer key={productsArray.length}>
                {productsArray.map(product => (
                  <CardItem color={Colors.darkBlue} key={product.name}>
                    <ItemText size="small">{product.name}</ItemText>
                    <ItemText size="25px" weight="400">{product.stock}un</ItemText>
                  </CardItem>
                ))}
              </ItemsContainer>
            ))}
          </CardContainer>
        </Card>

        <Card>
          <CardHeader>
            <HeaderText>
              <FontAwesomeIcon style={{ marginRight: 15 }} icon={faUser} size="1x" color="gray" />
              Representantes
            </HeaderText>
          </CardHeader>

          <CardContainer>
            {threeResellersArray.map(resellersArray => (
              <ItemsContainer>
                {resellersArray.map(reseller => (
                  <CardItem color={Colors.darkBlue}>
                    <ItemText size="large" weight="500">{reseller.name}</ItemText>
                  </CardItem>
                ))}
              </ItemsContainer>
            ))}
          </CardContainer>
        </Card>
      </DefaultContainer>

      <Navbar />
    </>
  );
}

export default Home;