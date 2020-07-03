import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { OperationLights } from './OperationLights';
import { HttpVerb, SwagoMethod } from '../../models/types';

const Root = styled.div``;

const Header = styled.div.attrs(({ selected }: { selected: boolean }): any => ({
  background: selected ? 'rgba(51,153,186,0.5)' : 'white',
  borderColor: selected ? '#519aba' : 'transparent',
}))`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
  background: ${(props) => props.background};
  user-select: none;
  border: 1px solid;
  border-color: ${(props) => props.borderColor};
  outline: none;
  &:hover {
    border-color: #519aba;
  }
`;

const Leaf = styled(FontAwesomeIcon)`
  font-size: 6px;
  padding: 9px 10px 9px 9px;
  color: #242424;
`;

const Name = styled.div`
  padding-left: 4px;
`;

type Props = {
  method: SwagoMethod;
  selected: boolean;
};

export const MethodListItem = (props: Props): JSX.Element => {
  const { method, selected } = props;

  const activeVerbs: HttpVerb[] = method.operations.map((o) => o.verb);

  return (
    <Root>
      <Header selected={selected}>
        <Leaf icon={faMinus} fixedWidth />
        <Name>
          <span title={method.path}>{method.path}</span>
        </Name>
        <OperationLights verbs={activeVerbs} />
      </Header>
    </Root>
  );

  return <></>;
};
