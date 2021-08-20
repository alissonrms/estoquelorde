import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
`;

export const ProductContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProductName = styled.div`
  display: flex;
  align-items: center;
  font-size: medium;
  color: darkgray;
`;

export const QuantityContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const QuantityInput = styled.input`
  width: 50px;
  color: #666;
  border-radius: 10px;
  border: solid darkgray 1px;
  text-align: center;
  margin: 0;
`;

export const QuantityControlButton = styled.button`
  background-color: transparent;
  outline: none;
  box-shadow: none;
  border: none;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  &:disabled{
    opacity: 0.7;
  }
`;



