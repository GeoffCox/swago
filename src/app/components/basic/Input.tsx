import styled from 'styled-components';

export const Input = styled.input`
  border: 1px solid #424242;
  color: #242424;
  background: #fcfcfc;
  padding: 0.4em;
  outline: none;  
  &:focus {
    border: 1px solid #519aba;
    background: white;
  }
  &:hover:enabled {
    background: white;
    border: 1px solid #000;
    color: black;
  }
  &:disabled {
    border-color: #cccccc;
    background: #efefef;
    color: #cacaca;
    font-weight: normal;
  }
`;
