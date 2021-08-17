import React, { useEffect, useState } from 'react';

import api from '../../services/api';

import { DefaultContainer } from '../../components/DefaultContainer';
import Navbar from '../../components/Navbar';

import Colors from '../../constants/Colors';
import { Card, CardHeader, HeaderText, CardContainer, CardItem, ItemsContainer, ItemText } from '../../components/Card';
import { Button } from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';

function BankStatement() {

  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const [statementList, setStatementList] = useState([]);

  useEffect(() => {
    api.get('statement-list', {
      headers: {
        authorization: token,
        id_user: userId
      }
    }).then(response => {
      setStatementList(response.data)
    })
  }, [userId, token])

  return (
    <>
      <DefaultContainer>
        {statementList.map((statementItem, index) => (
          <Card color={Colors.green}>
            <CardHeader>
              <HeaderText color='white'>
                <FontAwesomeIcon style={{ marginRight: 15 }} icon={faCoins} size="1x" color="white" />
                Venda
              </HeaderText>

              <HeaderText color='white'>11/06/2021<br />12:56</HeaderText>
            </CardHeader>

            <CardContainer>
              <ItemsContainer>
                <CardItem color='white'>
                  <ItemText size="small">Valor</ItemText>
                  <ItemText size="medium" weight="400">R$4.000,00</ItemText>
                </CardItem>

                <CardItem color='white'>
                  <ItemText size="small">Tipo</ItemText>
                  <ItemText size="medium" weight="400">À vista</ItemText>
                </CardItem>

                <CardItem color='white'>
                  <ItemText size="small">Representante</ItemText>
                  <ItemText size="medium" weight="400">José da Cunha</ItemText>
                </CardItem>
              </ItemsContainer>

              <ItemsContainer>
                <Button width="49%" height="50px" color={Colors.lightBlue}>Alterar</Button>
                <Button width="49%" height="50px" color={Colors.orange}>Excluir</Button>
              </ItemsContainer>
            </CardContainer>
          </Card>
        ))}
        <Card color={Colors.green}>
          <CardHeader>
            <HeaderText color='white'>
              <FontAwesomeIcon style={{ marginRight: 15 }} icon={faCoins} size="1x" color="white" />
              Venda
            </HeaderText>

            <HeaderText color='white'>11/06/2021<br />12:56</HeaderText>
          </CardHeader>

          <CardContainer>
            <ItemsContainer>
              <CardItem color='white'>
                <ItemText size="small">Valor</ItemText>
                <ItemText size="medium" weight="400">R$4.000,00</ItemText>
              </CardItem>

              <CardItem color='white'>
                <ItemText size="small">Tipo</ItemText>
                <ItemText size="medium" weight="400">À vista</ItemText>
              </CardItem>

              <CardItem color='white'>
                <ItemText size="small">Representante</ItemText>
                <ItemText size="medium" weight="400">José da Cunha</ItemText>
              </CardItem>
            </ItemsContainer>
          </CardContainer>
        </Card>
        <Card color={Colors.red}>
          <CardHeader>
            <HeaderText color='white'>
              <FontAwesomeIcon style={{ marginRight: 15 }} icon={faSortAmountDown} size="1x" color="white" />
              Despesa
            </HeaderText>

            <HeaderText color='white'>11/06/2021<br />12:56</HeaderText>
          </CardHeader>

          <CardContainer>
            <ItemsContainer>
              <CardItem color='white'>
                <ItemText size="small">Valor</ItemText>
                <ItemText size="medium" weight="400">R$4.000,00</ItemText>
              </CardItem>

              <CardItem color='white'>
                <ItemText size="small">Tipo</ItemText>
                <ItemText size="medium" weight="400">À vista</ItemText>
              </CardItem>

              <CardItem color='white'>
                <ItemText size="small">Representante</ItemText>
                <ItemText size="medium" weight="400">José da Cunha</ItemText>
              </CardItem>
            </ItemsContainer>
          </CardContainer>
        </Card>
        <Card color={Colors.darkBlue}>
          <CardHeader>
            <HeaderText color='white'>
              <FontAwesomeIcon style={{ marginRight: 15 }} icon={faCoins} size="1x" color="white" />
              Venda
            </HeaderText>

            <HeaderText color='white'>11/06/2021<br />12:56</HeaderText>
          </CardHeader>

          <CardContainer>
            <ItemsContainer>
              <CardItem color='white'>
                <ItemText size="small">Valor</ItemText>
                <ItemText size="medium" weight="400">R$4.000,00</ItemText>
              </CardItem>

              <CardItem color='white'>
                <ItemText size="small">Tipo</ItemText>
                <ItemText size="medium" weight="400">À vista</ItemText>
              </CardItem>

              <CardItem color='white'>
                <ItemText size="small">Representante</ItemText>
                <ItemText size="medium" weight="400">José da Cunha</ItemText>
              </CardItem>
            </ItemsContainer>
          </CardContainer>
        </Card>
      </DefaultContainer>

      <Navbar />
    </>
  )
}

export default BankStatement;