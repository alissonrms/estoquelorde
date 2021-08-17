import React from 'react';

import { Container, Item } from './styles';
import { useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faScroll, faCoins, faDollyFlatbed, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  let location = useLocation();

  return (
    <Container>
      <Item to="/" currentactive={location.pathname === "/" ? 'true' : 'false'}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faHome} size="1x" />
      </Item>
      <Item to="/extrato" currentactive={location.pathname === "/extrato" ? 'true' : 'false'}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faScroll} size="1x" />
      </Item>
      <Item to="/nova/venda" currentactive={location.pathname === "/nova/venda" ? 'true' : 'false'}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faCoins} size="1x" />
      </Item>
      <Item to="/nova/despesa" currentactive={location.pathname === "/nova/despesa" ? 'true' : 'false'}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faSortAmountDown} size="1x" />
      </Item>
      <Item to="/nova/entrada-produto" currentactive={location.pathname === "/nova/entrada-produto" ? 'true' : 'false'}>
        <FontAwesomeIcon style={{marginBottom: 5}} icon={faDollyFlatbed} size="1x" />
      </Item>
    </Container>
  );
}

export default Navbar;