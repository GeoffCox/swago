import * as React from 'react';
import styled from 'styled-components';
import { OpenAPIV2 } from 'openapi-types';
import { TypeHierarchyContext } from './typeHierarchyContext';

const Code = styled.span`
  font-family: 'Source Code Pro', Consolas, 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
`;

type Props = {
  context: TypeHierarchyContext;
  openApiType: OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject;
};

export const AnyTypeCard = (props: Props): JSX.Element => {
  const { context, openApiType } = props;

  return (
    <>            
      <Code title={JSON.stringify(openApiType)}>(any){context.suffix}</Code>
    </>);      
};
