import * as React from 'react';
import styled from 'styled-components';
import { OperationCard } from './OperationCard';
import { OperationPivot } from './OperationPivot';
import { SwagoMethod } from '../../models/types';
import { selectedOperationVerbState } from '../../models/atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { selectedOperationSelector } from '../../models/selectors';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr 1px;
  grid-template-areas: 'header' 'separator' 'content' 'footer';
  outline: none;
`;

const Header = styled.div`
  grid-area: header;
  margin: 0 25px 0 25px;
`;

const Separator = styled.div`
  grid-area: separator;
  height: 1px;
  box-sizing: border-box;
  background: silver;
`;

const Content = styled.div`
  grid-area: content;
  overflow-x: auto;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Footer = styled.div`
  grid-area: footer;
  min-height: 1px;
  background: transparent;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 15px 0 0 0;
`;

const PivotArea = styled.div`
  margin: 15px 0 0 0;
`;

const OperationArea = styled.div`
  margin: 25px 0 0 25px;
`;

type Props = {
  method: SwagoMethod;
};

export const MethodCard =
  (props: Props): JSX.Element => {
    const { method } = props;

    const setSelectedVerb = useSetRecoilState(selectedOperationVerbState);
    const selectedOperation = useRecoilValue(selectedOperationSelector);

    const activeVerbs = method.operations.map((o) => o.verb);

    // selects the previous verb and wraps back to end of list
    const selectPreviousVerb = () => {
      if (activeVerbs.length > 0) {
        if (selectedOperation) {
          const index = activeVerbs.indexOf(selectedOperation.verb);
          const previousIndex = index < 0 ? 0 : index === 0 ? activeVerbs.length - 1 : index - 1;
          setSelectedVerb(activeVerbs[previousIndex]);
        } else {
          setSelectedVerb(activeVerbs[0]);
        }
      }
    };

    // selects the next verb and wraps back to start of list
    const selectNextVerb = () => {
      if (activeVerbs.length > 0) {
        if (selectedOperation) {
          const index = activeVerbs.indexOf(selectedOperation.verb);
          const nextIndex = index < 0 ? 0 : (index + 1) % activeVerbs.length;
          setSelectedVerb(activeVerbs[nextIndex]);
        } else {
          setSelectedVerb(activeVerbs[0]);
        }
      }
    };

    const handleKeyUp = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Tab':
          if (event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            if (event.shiftKey) {
              selectPreviousVerb();
            } else {
              selectNextVerb();
            }
          }
          break;
        default:
          break;
      }
    };

    return (
      method && (
        <Root tabIndex={-1} onKeyUp={handleKeyUp}>
          <Header>
            <Title>{method.path}</Title>
            <PivotArea>
              <OperationPivot verbs={activeVerbs} selected={selectedOperation?.verb} onChange={(verb) => setSelectedVerb(verb)} />
            </PivotArea>
          </Header>
          <Separator />
          <Content>
            <OperationArea>
              {selectedOperation && selectedOperation?.operation && (
                <OperationCard httpVerb={selectedOperation?.verb} path={method.path} operation={selectedOperation.operation} />
              )}
            </OperationArea>
          </Content>
          <Footer />
        </Root>
      )
    );
  };
