import * as React from 'react';
import { OpenAPIV2 } from 'openapi-types';
import { TypeHierarchyContext } from './typeHierarchyContext';
import styled from 'styled-components';

const ResolveRefLine = styled.div``;

type Props = {
  context: TypeHierarchyContext;
  openApiType: OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject;
};

export const TypeCard = (props: Props): JSX.Element => {
  const {
    context,
    context: { resolvedRef, suffix, visitedRefs },
    openApiType: schema
  } = props;

  // resolve references
  const refObject = schema as OpenAPIV2.ReferenceObject;
  if (refObject && refObject.$ref) {
    if (visitedRefs.every(r => r !== refObject.$ref)) {
      const schemaObject = context.resolveRef(refObject.$ref);
      if (schemaObject && schemaObject.type) {
        const newContext = { ...context, resolvedRef: refObject.$ref, visitedRefs: visitedRefs.concat(refObject.$ref) };
        return context.renderType({ context: newContext, openApiType: schemaObject });
      }
    }

    return context.renderTypeRefLink({ context, openApiType: refObject.$ref });
  }

  const schemaObject = schema as OpenAPIV2.SchemaObject;

  // determine how to render the type
  const renderType = (): JSX.Element => {
    const typeContext = { ...context, resolvedRef: undefined };

    if (schemaObject && schemaObject.type) {
      switch (schemaObject.type) {
        case 'string':
        case 'boolean':
        case 'integer':
        case 'number':
          return context.renderPrimitiveType({ context: typeContext, openApiType: schemaObject });
        case 'null':
          return context.renderNullType({ context: typeContext, openApiType: schemaObject });
        case 'array':
          if (schemaObject.items) {
            return context.renderArrayType({ context: typeContext, openApiType: schemaObject.items });
          }
          const newSuffix = suffix ? '[]'.concat(suffix) : '[]';
          return context.renderUndefinedType({ context: { ...typeContext, suffix: newSuffix }, openApiType: schemaObject });
        case 'object':
          if (schemaObject.properties) {
            return context.renderObjectType({ context: typeContext, openApiType: schemaObject });
          }

          if (schemaObject.additionalProperties) {
            const supportedAdditionalProperties = schemaObject.additionalProperties as OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject;
            if (supportedAdditionalProperties) {
              return context.renderAssociativeArrayType({ context: typeContext, openApiType: supportedAdditionalProperties });
            }
          }
          break;
      }
    }

    return context.renderUndefinedType({ context: typeContext, openApiType: schema });
  };

  return (
    <>
      {resolvedRef && <ResolveRefLine>{context.renderTypeRefLink({ context : {...context, suffix: ''}, openApiType: resolvedRef })}</ResolveRefLine>}
      {renderType()}
    </>
  );
};
