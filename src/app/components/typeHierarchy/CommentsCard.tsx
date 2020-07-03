import * as React from 'react';
import styled from 'styled-components';
import { OpenAPIV2 } from 'openapi-types';
import { TypeHierarchyContext } from './typeHierarchyContext';
import { getSchemaObjectComments } from '../../getSwaggerComments';

const Root = styled.div``;

const Comment = styled.div`
  font-family: 'Source Code Pro', Consolas, 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
  color: #008229;
`;

type Props = {
  context: TypeHierarchyContext;
  openApiType: OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject;
  name: string;
  required?: boolean;
};

export const CommentsCard = (props: Props): JSX.Element => {
  const { openApiType, name, required } = props;

  const comments: string[] = [];
  comments.push(name);
  comments.push('-'.repeat(name.length));
  required !== undefined && comments.push(`required: ${required}`);
  comments.push(...getSchemaObjectComments(openApiType));

  return (
    <Root>
      {comments.length > 0 && (
        <>
          <Comment>/*</Comment>
          {comments.map((c) => (
            <Comment> * {c}</Comment>
          ))}
          <Comment> */</Comment>
        </>
      )}
    </Root>
  );
};
