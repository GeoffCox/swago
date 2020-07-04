import * as React from 'react';
import styled from 'styled-components';
import { OpenAPIV2 } from 'openapi-types';
import { getParameterObjectComments } from '../../getSwaggerComments';
import { DeepTypeCard } from './DeepTypeCard';

const Root = styled.div``;

const Code = styled.span`
  font-family: 'Source Code Pro', 'Consolas', 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
`;

const Comment = styled.div`
  font-family: 'Source Code Pro', 'Consolas', 'Segeo UI', Verdana, sans-serif;
  white-space: pre;
  color: #008229;
`;

const Header = styled.div`
  margin: 0 0 5px 0;
`;

const Details = styled.div`
  margin: 0 0 0 10px;
`;

const Body = styled.div``;

type Props = {
  parameter: OpenAPIV2.ParameterObject;
};

/**
 *
 */
export const ParameterCard = (props: Props): JSX.Element => {
  const { parameter } = props;

  const comments = getParameterObjectComments(parameter);

  const renderParameterComments = () => {
    return (
      <>
        <Comment>/*</Comment>
        {comments.map((c) => (
          <Comment> * {c}</Comment>
        ))}
        <Comment> */</Comment>
      </>
    );
  };

  const renderNameValueParameter = (name: string) => {
    return (
      <Root>
        <Header>
          {renderParameterComments()}
          <div>
            <Code>
              {name} : {parameter.type}
            </Code>
          </div>
        </Header>
      </Root>
    );
  };

  const renderBodyParameter = () => {
    const bodyParameterObject = parameter as OpenAPIV2.InBodyParameterObject;
    return (
      <Root>
        <Header>{renderParameterComments()}</Header>
        <Details>
          {bodyParameterObject.schema && (
            <Body>
              <DeepTypeCard openApiType={bodyParameterObject.schema} />
            </Body>
          )}
        </Details>
      </Root>
    );
  };

  switch (parameter.in) {
    case 'path':
      return renderNameValueParameter(`{${parameter.name}}`);
      break;
    case 'query':
      return renderNameValueParameter(`&${parameter.name}`);
    case 'body':
      return renderBodyParameter();
    default:
      break;
  }

  return renderNameValueParameter(parameter.name);
};
