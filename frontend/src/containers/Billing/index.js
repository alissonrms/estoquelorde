import React from 'react';

import { Card, CardHeader, HeaderText, CardContainer, ItemsContainer, CardItem, ItemText } from '../../components/Card';
import { DefaultContainer } from '../../components/DefaultContainer';
import Navbar from '../../components/Navbar';

import Colors from '../../constants/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faBox } from '@fortawesome/free-solid-svg-icons'


function Billing() {
  return (
    <>
    <DefaultContainer>
      <Card>
        <CardHeader>
          <HeaderText>
            <FontAwesomeIcon style={{marginRight: 15}} icon={faDollarSign} size="1x" color="gray" />
            Faturamento do Mês
          </HeaderText>

          <HeaderText>06/2021</HeaderText>
        </CardHeader>

        <CardContainer>
          <CardItem color={Colors.green}>
            <ItemText size="small">Vendas</ItemText>
            <ItemText size="25px" weight="400">R$4.000,00</ItemText>
          </CardItem>

          <ItemsContainer>
            <CardItem color={Colors.red} marginTop>
              <ItemText size="small">Despesas</ItemText>
              <ItemText size="25px" weight="400">R$480,00</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Entrada de Produtos</ItemText>
              <ItemText size="25px" weight="400">R$1.200,00</ItemText>
            </CardItem>
          </ItemsContainer>

          <CardItem color="black" marginTop>
            <ItemText size="medium">Saldo</ItemText>
            <ItemText size="34px" weight="400">R$2.320,00</ItemText>
          </CardItem>
        </CardContainer>
      </Card>

      <Card>
        <CardHeader>
          <HeaderText>
            <FontAwesomeIcon style={{marginRight: 15}} icon={faBox} size="1x" color="gray" />
            Estoque de Produtos
          </HeaderText>
        </CardHeader>

        <CardContainer>
          <ItemsContainer>
            <CardItem color={Colors.darkBlue}>
              <ItemText size="small">Produto 1</ItemText>
              <ItemText size="25px" weight="400">30un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue}>
              <ItemText size="small">Produto 2</ItemText>
              <ItemText size="25px" weight="400">30un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue}>
              <ItemText size="small">Produto 3</ItemText>
              <ItemText size="25px" weight="400">25un</ItemText>
            </CardItem>
          </ItemsContainer>

          <ItemsContainer>
            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 4</ItemText>
              <ItemText size="25px" weight="400">14un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 5</ItemText>
              <ItemText size="25px" weight="400">14un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 6</ItemText>
              <ItemText size="25px" weight="400">56un</ItemText>
            </CardItem>
          </ItemsContainer> 

          <ItemsContainer>
            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 7</ItemText>
              <ItemText size="25px" weight="400">23un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 8</ItemText>
              <ItemText size="25px" weight="400">23un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 9</ItemText>
              <ItemText size="25px" weight="400">98un</ItemText>
            </CardItem>
          </ItemsContainer>

          <ItemsContainer>
            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 10</ItemText>
              <ItemText size="25px" weight="400">12un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 11</ItemText>
              <ItemText size="25px" weight="400">12un</ItemText>
            </CardItem>

            <CardItem color={Colors.darkBlue} marginTop>
              <ItemText size="small">Produto 12</ItemText>
              <ItemText size="25px" weight="400">54un</ItemText>
            </CardItem>
          </ItemsContainer>
        </CardContainer>
      </Card>
    </DefaultContainer>

    <Navbar />
    </>
  );
}

export default Billing;