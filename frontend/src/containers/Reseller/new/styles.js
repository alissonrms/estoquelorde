import styled from 'styled-components';

export const PageTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-top: 10px;
  margin-bottom: 5px;
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

export const ResellerName = styled(Input).attrs({
  placeholder: 'Digite o nome do Representante'
})`
`;

export const Container = styled.div`
  flex: 1;
  padding: 5%;
`;