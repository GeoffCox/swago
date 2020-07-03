import * as React from 'react';
import styled from 'styled-components';
import { TypeHierarchyContext } from './typeHierarchyContext';
import { RegularButton } from '../basic/Button';

const Link = styled(RegularButton)`   
  font-family: 'Source Code Pro', Consolas, 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
`;

const Code = styled.span`
  font-family: 'Source Code Pro', Consolas, 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
`;

const getRefName = (refPath: string) => {
  let refName = refPath;
  const refParts = refPath ? refPath.split('/') : [];
  if (refParts?.length > 0) {
    refName = refParts[refParts.length - 1];
  }
  return refName;
};

type Props = {
  context: TypeHierarchyContext;
  openApiType: string;
};

export const TypeRefLink = (props: Props): JSX.Element => {
  const {
    context,
    context: { suffix },
    openApiType: $ref
  } = props;

  const name = getRefName($ref);

  return (
    <>
      <Link title={$ref} onClick={() => context.onRefClick($ref, name)}>
        {name}
      </Link>
      <Code>{suffix}</Code>
    </>
  );
};
