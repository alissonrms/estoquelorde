import styled from 'styled-components';

export const DefaultContainer = styled.div`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 150px;
  margin-bottom: 180px;
  
  display: flex;
  flex-direction: column;
  align-items: ${props => props.center ? "center" : "start"};
  justify-content: ${props => props.center ? "center" : "start"};
`;
