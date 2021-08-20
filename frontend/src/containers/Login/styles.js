import styled from 'styled-components';

import Colors from '../../constants/Colors'; 

import boxLogo from '../../assets/box.png';

export const BoxLogo = styled.img.attrs({
  src: `${boxLogo}`,
})`
  margin-top: 80px;
  width: 180px;
  height: 180px;
  margin-bottom: 25px;
`;

export const Input = styled.input`
  border-radius: 50px;
  margin-top: 25px;
  text-align: center;
  font-size: 18px;
  width: 100%;
  height: 70px;
  padding: 10px;
  outline: none;
  border: none;
`;

export const Username = styled(Input).attrs({
  placeholder: 'Digite o nome de Usuário'
})`
`;

export const Password = styled(Input).attrs({
  placeholder: 'Digite a Senha',
  type: 'password'
})`
`;

export const Button = styled.button`
  border-radius: 50px;
  margin-top: 25px;
  width: 100%;
  height: 70px;
  outline: none;
  border: none;
  box-shadow: none;
  background-color: ${Colors.darkBlue};
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
`
