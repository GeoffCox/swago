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

const Property = styled.div``;

type Props = {
  context: TypeHierarchyContext;
  openApiType: OpenAPIV2.SchemaObject;
};

type SchemaObjectProperties = { [name: string]: OpenAPIV2.SchemaObject };

// Displays a schema object that is a primitive property
export const ObjectTypeCard = (props: Props): JSX.Element => {
  const { context, openApiType: schemaObject } = props;

  const propertyContext = { ...context, suffix: ';' };

  const requiredPropertyNames = schemaObject.required;

  const renderProperty = (name: string, propertyType: OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject) => {
    const required = requiredPropertyNames?.some((n) => n === name);
    return (
      <Property>
        {context.renderComments({ context, openApiType: propertyType, name, required })}
        <Code>{name} : </Code>
        {context.renderType({ context: propertyContext, openApiType: propertyType })}
      </Property>
    );
  };

  const renderProperties = (properties: SchemaObjectProperties) => {
    const keys = Object.keys(properties);
    return <>{keys.map((k) => renderProperty(k, properties[k]))}</>;
  };

  return (
    <>
      <Code>{'{'}</Code>
      <Block>{schemaObject.properties && renderProperties(schemaObject.properties)}</Block>
      <Code>
        {'}'}
        {context.suffix}
      </Code>
    </>
  );
};
