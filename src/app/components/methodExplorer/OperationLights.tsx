import * as React from 'react';
import styled from 'styled-components';
import { HttpVerb } from '../../models/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { allHttpVerbs } from '../../models/constants';
import { httpVerbToColor } from '../constants';

const Root = styled.div`
  font-size: 7px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
`;

const OperationLight = styled(FontAwesomeIcon).attrs(({ verbColor }: { verbColor: string }): any => ({
  color: verbColor,
}))`
  user-select: none;
  transition: color 0.5s;
  color: ${(props) => props.color};
`;

type Props = {
  verbs: HttpVerb[];
};

export const OperationLights = (props: Props): JSX.Element => {
  const { verbs } = props;

  const [selectedVerb, setSelectedVerb] = React.useState<HttpVerb | undefined>();

  React.useEffect(() => {
    if (selectedVerb && verbs.indexOf(selectedVerb) === -1) {
      setSelectedVerb(undefined);
    }
  }, [verbs]);

  return (
    <Root>
      {allHttpVerbs.map((verb) =>
        verbs.some((a) => a === verb) ? <OperationLight icon={faCircle} fixedWidth verbColor={httpVerbToColor[verb]} /> : <></>
      )}
    </Root>
  );
};
