import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { SwagoTypeDefinition } from '../../models/types';

const Root = styled.div`
  box-sizing: border-box;
  height: 100%;
  overflow: none;
  outline: none;
  position: relative;
  width: 100%;
`;

const Header = styled.div.attrs(({ selected }: { selected: boolean }): any => ({
  background: selected ? 'rgba(51,153,186,0.5)' : 'white',
  borderColor: selected ? '#519aba' : 'transparent',
}))`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
  background: ${(props) => props.background};
  user-select: none;
  width: 100%;
  cursor: pointer;
  border: 1px solid;
  border-color: ${(props) => props.borderColor};
  outline: none;
  &:hover {
    border-color: #519aba;
  }
`;

const ItemIcon = styled(FontAwesomeIcon)`
  font-size: 12px;
  padding: 6px;
  color: #242424;
`;

const Name = styled.div`
  padding-left: 4px;
`;

type Props = {
  typeDefinition: SwagoTypeDefinition;
  selected?: boolean;
};

export const TypeDefinitionListItem = 
  (props: Props): JSX.Element => {
    const { typeDefinition, selected = false } = props;

    return (
      <Root>
        <Header selected={selected}>
          <ItemIcon icon={faCube} fixedWidth />
          <Name>{typeDefinition.name}</Name>
        </Header>
      </Root>
    );

    return <></>;
  };
