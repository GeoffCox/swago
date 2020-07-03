import * as React from 'react';
import styled from 'styled-components';
import { OpenAPIV2 } from 'openapi-types';
import { ParameterCard } from './ParameterCard';
import { HttpVerb } from '../../models/types';
import { DeepTypeCard } from './DeepTypeCard';

const Root = styled.div``;

const Header = styled.div`
  font-size: 18px;
`;

const RequestSection = styled.div``;

const RequestSectionHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 0 0;
`;

const RequestParameters = styled.div`
  margin: 0 0 0 10px;
`;

const ParametersSection = styled.div`
  margin: 10px 0 0 0;
`;

const ParametersSectionHeader = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0 0 0;
`;

const Parameters = styled.div`
  margin: 10px 0 0 20px;
`;

const Parameter = styled.div`
  margin: 1em 0;
`;

const ResponseSection = styled.div``;

const ResponseSectionHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 0 0;
`;

const Responses = styled.div`
  margin: 10px 0 0 10px;
`;

const Response = styled.div`
  margin: 10px 0 0 0;
`;

const ResponseCode = styled.div`
  font-weight: bold;
`;

const ResponseDescription = styled.div`
  margin: 0 0 0 10px;
`;

const ResponseDetails = styled.div`
  margin: 0 0 0 10px;
`;

type Props = {
  httpVerb: HttpVerb;
  path: string;
  operation: OpenAPIV2.OperationObject;
};

const getParameterObjects = (parameters?: OpenAPIV2.Parameters): OpenAPIV2.ParameterObject[] => {
  const result = parameters
    ?.filter((p) => {
      const pathParameter = p as OpenAPIV2.ParameterObject;
      return pathParameter?.in !== undefined;
    })
    .map((p) => p as OpenAPIV2.ParameterObject);
  return result ?? [];
};

// I ensure the path parameters are sorted by the order they appear in the path
const getPathParameters = (path: string, parameters: OpenAPIV2.ParameterObject[]): OpenAPIV2.ParameterObject[] => {
  // find all the {name} in the path
  const paramNames = path.split('/').filter((p) => p.length > 0 && p.startsWith('{') && p.endsWith('}'));

  // build a case-insensitive lookup of {name} -> parameter for path parameters
  const pathParams: { [index: string]: OpenAPIV2.ParameterObject } = {};
  parameters
    .filter((p) => p.in === 'path')
    .forEach((p) => {
      const paramName = `{${p.name}}`;
      pathParams[paramName.toLowerCase()] = p;

      // if there is a path parameter that for some reason isn't in the path,
      // add it to the param names to make sure it doesn't get hidden
      if (!paramNames.some((n) => n === paramName)) {
        paramNames.push(paramName);
      }
    });

  return paramNames.map((n) => pathParams[n.toLowerCase()]);
};

export const OperationCard = (props: Props): JSX.Element => {
  const { httpVerb, path, operation } = props;

  const parameterObjects = getParameterObjects(operation.parameters) ?? [];
  const pathParameters = getPathParameters(path, parameterObjects);
  const queryParameters = parameterObjects.filter((p) => p.in === 'query');
  const headerParameters = parameterObjects.filter((p) => p.in === 'header');
  const bodyParameters = parameterObjects.filter((p) => p.in === 'body');

  const responseKeys = Object.keys(operation.responses);

  const renderParametersSection = (name: string, parameters: OpenAPIV2.ParameterObject[]) => {
    return (
      parameters.length > 0 && (
        <ParametersSection>
          <ParametersSectionHeader>{name}</ParametersSectionHeader>
          <Parameters>
            {parameters.map((p) => (
              <Parameter>
                <ParameterCard parameter={p} />
              </Parameter>
            ))}
          </Parameters>
        </ParametersSection>
      )
    );
  };

  const renderRequestSection = () => {
    return (
      parameterObjects.length > 0 && (
        <RequestSection>
          <RequestSectionHeader>Request</RequestSectionHeader>
          <RequestParameters>
            {renderParametersSection('Path', pathParameters)}
            {renderParametersSection('Query', queryParameters)}
            {renderParametersSection('Header', headerParameters)}
            {renderParametersSection('Body', bodyParameters)}
          </RequestParameters>
        </RequestSection>
      )
    );
  };

  const renderResponse = (code: string, response: OpenAPIV2.ResponseObject) => {
    const lines = response.description.split('\\r\\n');

    return (
      <Response>
        <ResponseCode>{code}</ResponseCode>
        <ResponseDescription>
          {lines.map((l) => (
            <p>{l}</p>
          ))}
        </ResponseDescription>
        <ResponseDetails>{response.schema && <DeepTypeCard openApiType={response.schema} />}</ResponseDetails>
      </Response>
    );
  };

  const renderResponseSection = () => {
    return (
      responseKeys.length > 0 && (
        <ResponseSection>
          <ResponseSectionHeader>Responses</ResponseSectionHeader>
          <Responses>
            {responseKeys.map((k) => (
              <div>
                {(operation.responses.default as OpenAPIV2.ResponseObject) && (
                  <div>{renderResponse('default', operation.responses.default as OpenAPIV2.ResponseObject)}</div>
                )}
                <div>{renderResponse(k, operation.responses[k])}</div>
              </div>
            ))}
          </Responses>
        </ResponseSection>
      )
    );
  };

  return (
    <Root>
      <Header title={`Operation ID: ${operation.operationId}`}>{httpVerb}</Header>
      <div>{operation.description}</div>
      {renderRequestSection()}
      {renderResponseSection()}
    </Root>
  );
};
