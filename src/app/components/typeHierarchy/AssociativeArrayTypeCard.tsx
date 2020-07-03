import * as React from 'react';
import styled from 'styled-components';
import { OpenAPIV2 } from 'openapi-types';
import { TypeHierarchyContext } from './typeHierarchyContext';

const Code = styled.span`
  font-family: 'Source Code Pro', Consolas, 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
`;

const Block = styled.div`
  margin-left: 2em;
`;

type Props = {
  context: TypeHierarchyContext;
  openApiType: OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject;
};

export const AssociativeArrayTypeCard = (props: Props): JSX.Element => {
  const { context, openApiType: valueType } = props;

  const newContext = { ...context, suffix: undefined };

  return (
    <>
      <Code>{'{'}</Code>
      <Block>
        <Code>[name : string] : </Code>
        {context.renderType({ context: newContext, openApiType: valueType })}
      </Block>
      <Code>
        {'}'}
        {context.suffix}
      </Code>
    </>
  );
};
