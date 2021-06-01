import styled from 'styled-components';

import Colors from '../../constants/Colors'; 

export const DefaultContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 150px;

  display: flex;
  flex-direction: column;
  align-items: ${props => props.center ? "center" : "start"};
  justify-content: ${props => props.center ? "center" : "start"};
  
  background-image: linear-gradient(${Colors.lightBlue}, ${Colors.darkBlue});
`;
