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
  openApiType: OpenAPIV2.SchemaObject;
};

export const PrimitiveTypeCard = (props: Props): JSX.Element => {
  const { context, context: {suffix}, openApiType: schemaObject } = props;

  if (schemaObject && schemaObject.type) {
    switch (schemaObject.type) {
      case 'string':
        const itemsObject = schemaObject as OpenAPIV2.ItemsObject;         
        
        //TODO: Move enum type?
        if (itemsObject.enum) {
          const enumValues = itemsObject.enum.map(e => `'${e}'`).join('|');
          return <Code>{enumValues}{suffix}</Code>;
        }
        return <Code>{schemaObject.type}{suffix}</Code>;
      case 'boolean':
      case 'integer':
      case 'null':
      case 'number':        
        return <Code>{schemaObject.type}{suffix}</Code>;
      case 'array':       
      case 'object':
        throw new Error('Cannot render complex type as a primitive.');
        break;
    }
  }

  return context.renderAnyType({context, openApiType: schemaObject});    
};
