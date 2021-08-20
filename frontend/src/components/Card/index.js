import styled from 'styled-components';

import Colors from '../../constants/Colors';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  border-radius: 8px;
  margin: 20px 0px;
  background-color: ${props => props.color || "white"};
`;

export const CardHeader = styled.div`
  padding-left: 15px;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderText = styled.p`
  padding: 0px;
  font-size: small;
  font-weight: 400;
  color: ${props => props.color || Colors.gray};
`;

export const CardContainer = styled.div`
  padding: 15px;
`;

export const ItemsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${props => props.color || Colors.gray};
  margin-top: ${props => props.marginTop ? "15px" : "0px"};
`;

export const ItemText = styled.p`
  padding: 0px;
  font-size: ${props => props.size || '18px'};
  font-weight: ${props => props.weight || '400'};
`;


