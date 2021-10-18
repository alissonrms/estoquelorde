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

export const QuantityInput = styled.input.attrs({
  type: `number`,
})`
  width: 50px;
  color: #666;
  border: solid darkgray 1px;
  border-left: none;
  border-right: none;
  text-align: center;
  margin: 0;
`;

export const QuantityControlButton = styled.button`
  background-color: transparent;
  outline: none;
  box-shadow: none;
  border: solid darkgray 1px;
  margin: 0;
  padding: 4px;
  border-left: ${props => props.right ? 'none' : 'solid darkgray 1px' };
  border-right: ${props => props.left ? 'none' : 'solid darkgray 1px' };

  border-top-right-radius: ${props => props.right ? '5px' : '0' };
  border-bottom-right-radius: ${props => props.right ? '5px' : '0' };
  border-top-left-radius: ${props => props.left ? '5px' : '0' };
  border-bottom-left-radius: ${props => props.left ? '5px' : '0' };
  -webkit-tap-highlight-color: transparent;
  &:disabled{
    opacity: 0.7;
  }
`;



