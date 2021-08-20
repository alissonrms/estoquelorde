import styled from 'styled-components';
import Colors from '../../../constants/Colors';

export const Container = styled.div`
  flex: 1;
  padding: 5%;
  margin-bottom: 200px;
`;

export const ActionButtonsContainer = styled.div`
  align-self: flex-end;
`;

export const IconButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  box-shadow: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  margin-right: 3px;
`;

export const NewButton = styled.button`
  position: fixed;
  bottom: 100px;
  left: 5%;
  border-radius: 50px;
  width: 90%;
  height: 70px;
  outline: none;
  border: none;
  box-shadow: none;
  background-color: ${Colors.green};
  color: white;
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
  &:active{
    background-color: transparent;
    transition: 150ms;
  }
  &:disabled{
    opacity: 0.7;
  }
`;
