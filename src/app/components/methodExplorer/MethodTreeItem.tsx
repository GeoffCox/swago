import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import { OperationLights } from './OperationLights';
import { HttpVerb, SwagoMethod } from '../../models/types';

const Root = styled.div``;

const Header = styled.div.attrs(({ selected }: { selected: boolean }): any => ({
  background: selected ? 'rgba(51,153,186,0.5)' : 'white',
  borderColor: selected ? '#519aba' : 'transparent',
}))`
  background: ${(props) => props.background};
  user-select: none;
  border: 1px solid;
  border-color: ${(props) => props.borderColor};
  outline: none;
  &:hover {
    border-color: #519aba;
  }
`;

const Indent = styled.div.attrs(({ level }: { level: number }): any => ({
  marginLeft: `${level * 5}px`,
}))`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
  margin-left: ${(props) => props.marginLeft};
`;

const ExpandCollapse = styled(FontAwesomeIcon)`
  font-size: 12px;
  padding: 6px;
  color: #242424;  
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
  level: number;
  expanded: boolean;
  hasChildren: boolean;
  selected: boolean;
  expandCollapse: (expand?: boolean) => void;
};

export const MethodTreeItem = (props: Props): JSX.Element => {
  const { method, level, expanded, hasChildren, selected, expandCollapse } = props;

  const activeVerbs: HttpVerb[] = method.operations.map(o => o.verb);

  const onItemClick = (e: React.MouseEvent) => {
    if (selected) {
      expandCollapse();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onExpandCollapseClick = (e: React.MouseEvent) => {
    expandCollapse();
    e.preventDefault();
    e.stopPropagation();
  };

  const renderIcon = () => {
    return hasChildren ? (
      <ExpandCollapse icon={expanded ? faChevronDown : faChevronRight} fixedWidth onClick={onExpandCollapseClick} />
    ) : (
      <Leaf icon={faMinus} fixedWidth />
    );
  };

  return (
    <Root onClick={onItemClick}>
      <Header selected={selected}>
        <Indent level={level}>
          {renderIcon()}
          <Name>
            <span title={method.path}>{method.name}</span>
          </Name>
          <OperationLights verbs={activeVerbs} />
        </Indent>
      </Header>
    </Root>
  );
};
