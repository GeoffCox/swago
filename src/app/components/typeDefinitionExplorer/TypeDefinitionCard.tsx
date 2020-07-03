import * as React from 'react';
import styled from 'styled-components';
import { FlatTypeCard } from './FlatTypeCard';
import { SwagoTypeDefinition } from '../../models/types';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr 1px;
  grid-template-areas: 'header' 'separator' 'content' 'footer';
`;

const Header = styled.div`
  grid-area: header;
  margin: 0 25px 15px 25px;
`;

const Separator = styled.div`
  grid-area: separator;
  height: 1px;
  box-sizing: border-box;
  background: silver;
`;

const Content = styled.div`
  grid-area: content;
  overflow-x: auto;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Footer = styled.div`
  grid-area: footer;
  min-height: 1px;
  background: transparent;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 15px 0 0 0;
`;

const Details = styled.div`
  width: auto;
  height: auto;
  overflow: hidden;
  position: relative;
  margin: 15px 0 0 25px;
`;

type Props = {
  typeDefinition: SwagoTypeDefinition;
};

export const TypeDefinitionCard = (props: Props): JSX.Element => {
  const { typeDefinition } = props;

  return (
    typeDefinition && (
      <Root>
        <Header>
          <Title>{typeDefinition.name}</Title>
        </Header>
        <Separator />
        <Content>
          <Details>
            <FlatTypeCard openApiType={typeDefinition.schemaObject} />
          </Details>
        </Content>
        <Footer />
      </Root>
    )
  );
};
