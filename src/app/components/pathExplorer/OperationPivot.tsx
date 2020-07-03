import * as React from 'react';
import styled from 'styled-components';
import { HttpVerb } from '../../models/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { color } from 'csx';
import { allHttpVerbs } from '../../models/constants';
import { httpVerbToColor } from '../constants';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
`;

const PivotItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 8px 0 0;
  min-width: 75px;
`;

const PivotButton = styled.button.attrs(({ baseColor, selected, disabled }: { baseColor: string; selected: boolean; disabled: boolean }): any => ({
  background: disabled ? 'transparent' : selected ? color(baseColor).lighten('20%').toString() : 'transparent',
  borderColor: disabled ? 'transparent' : color(baseColor).darken('20%').toString(),
  color: disabled ? '#DDD' : baseColor,
  hoverBackground: disabled ? 'transparent' : color(baseColor).lighten('20%').toString(),
  hoverBorderColor: disabled ? 'transparent' : color(baseColor).darken('20%').toString(),
}))`
  font-size: 18px;
  padding: 4px 4px 8px 4px;
  background: ${(props) => props.background};
  border: 1px solid transparent;
  color: ${(props) => props.color};
  user-select: none;
  transition: background-color 0.5s;
  outline: none;
  &:hover {
    background: ${(props) => props.hoverBackground};
    color: ${(props) => props.hoverBorderColor};
  }
  &:disabled {
    color: #ddd;
    font-weight: normal;
  }
`;

const PivotIndicator = styled.div`
  position: relative;
  height: 14px;
  margin: -4px 0 0 0;
`;

const PivotIconArea = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PivotIcon = styled(FontAwesomeIcon).attrs(({ verbColor, verbDisabled }: { verbColor: string; verbDisabled: boolean }): any => ({
  color: verbDisabled ? '#DDD' : verbColor,
}))`
  font-size: 10px;
  color: ${(props) => props.color};
`;

const PivotUnderline = styled.div.attrs(({ verbColor, verbDisabled }: { verbColor: string; verbDisabled: boolean }): any => ({
  color: verbDisabled ? 'transparent' : verbColor,
}))`
  position: absolute;
  left: 0;
  top: 4px;
  right: 0;
  bottom: 0;
  height: 2px;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: ${(props) => props.color};
  width: 100%;
`;

type Props = {
  verbs: HttpVerb[];
  selected?: HttpVerb;
  onChange: (value?: HttpVerb) => void;
  className?: string;
};

export const OperationPivot = (props: Props): JSX.Element => {
  const { verbs, selected, onChange } = props;

  return (
    <Root>
      {allHttpVerbs.map((verb) => {
        const disabled = !verbs.some((a) => a === verb);
        return (
          <PivotItem>
            <PivotButton onClick={() => onChange(verb)} disabled={disabled} baseColor={httpVerbToColor[verb]} selected={verb === selected}>
              {verb}
            </PivotButton>
            <PivotIndicator>
              {verb === selected && <PivotUnderline verbColor={httpVerbToColor[verb]} verbDisabled={disabled} />}
              <PivotIconArea onClick={() => onChange(verb)}>
                <PivotIcon icon={faCircle} fixedWidth verbColor={httpVerbToColor[verb]} verbDisabled={disabled} />
              </PivotIconArea>
            </PivotIndicator>
          </PivotItem>
        );
      })}
    </Root>
  );
};
