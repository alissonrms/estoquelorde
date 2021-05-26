import styled from 'styled-components';

import boxLogo from '../../assets/box.png';

const lightBlue = '#00A6ED';
const darkBlue = '#0D2C54';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(${lightBlue}, ${darkBlue});
`;

export const BoxLogo = styled.img.attrs({
  src: `${boxLogo}`,
})`
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
  background-color: ${darkBlue};
  color: white;
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
  &:active{
    background-color: transparent;
    border: 1px solid white;
    transition: 150ms;
  }
`
