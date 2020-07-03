import styled from 'styled-components';

export const RegularButton = styled.button`
  background: #fafafa;
  color: #242424;
  border: 1px solid #cccccc;
  transition: background-color 0.5s, color 0.5s;
  border-radius: 0.25em;
  outline: none;
  &:focus {
    border: 1px solid #519aba;
  }
  &:hover:enabled {
    background: #e1e1e1;
    border: 1px solid #242424;
    color: black;
  }
  &:disabled {
    border-color: #cccccc;
    background: #efefef;
    color: #cacaca;
    font-weight: normal;
  }
`;
