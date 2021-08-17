import styled from 'styled-components';

import Colors from '../../constants/Colors';

export const Button = styled.button`
  border-radius: 50px;
  margin-top: 25px;
  width: ${props => props.width || "100%"};
  height: ${props => props.height || "70px"};
  outline: none;
  border: none;
  box-shadow: none;
  background-color: ${props => props.color || Colors.darkBlue};
  color: ${props => props.fontColor || 'white'};
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
  &:active{
    background-color: transparent;
    transition: 150ms;
  }
  &:disabled{
    opacity: 0.7;
  }
`
