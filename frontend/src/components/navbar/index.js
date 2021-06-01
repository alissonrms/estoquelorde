import React from 'react';

import { Container, Item } from './styles';
import { useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faDollarSign, faBoxes, faUserAlt, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  let location = useLocation();

  return (
    <Container>
      <Item to="/faturamento" active={location.pathname === "/faturamento"}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faChartLine} size="1x" />
      </Item>
      <Item to="/extrato" active={location.pathname === "/extrato"}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faDollarSign} size="1x" />
      </Item>
      <Item to="/estoque" active={location.pathname === "/extrato"}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faBoxes} size="1x" />
      </Item>
      <Item to="/representantes" active={location.pathname === "/extrato"}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faUserAlt} size="1x" />
      </Item>
      <Item to="/despesas" active={location.pathname === "/extrato"}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faSortAmountDown} size="1x" />
      </Item>
    </Container>
  );
}

export default Navbar;