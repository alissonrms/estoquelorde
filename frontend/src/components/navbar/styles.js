import styled from 'styled-components';
import Colors from '../../constants/Colors';

import { Link } from 'react-router-dom';

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: ${Colors.darkBlue};
  opacity: 0.8;

  display: grid;
  grid-template-columns: auto auto auto auto auto;
`;

export const Item = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${props => props.active ? Colors.lightBlue : ''};
`;
