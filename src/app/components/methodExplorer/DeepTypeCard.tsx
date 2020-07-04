import * as React from 'react';
import { OpenAPIV2 } from 'openapi-types';
import { TypeHierarchyContext } from '../typeHierarchy/typeHierarchyContext';
import { TypeCard } from '../typeHierarchy/TypeCard';
import { TypeRefLink } from '../typeHierarchy/TypeRefLink';
import { PrimitiveTypeCard } from '../typeHierarchy/PrimitiveTypeCard';
import { ArrayTypeCard } from '../typeHierarchy/ArrayTypeCard';
import { AssociativeArrayTypeCard } from '../typeHierarchy/AssociativeArrayTypeCard';
import { ObjectTypeCard } from '../typeHierarchy/ObjectTypeCard';
import { AnyTypeCard } from '../typeHierarchy/AnyTypeCard';
import { UndefinedTypeCard } from '../typeHierarchy/UndefinedTypeCard';
import { useSetRecoilState } from 'recoil';
import { selectedTypeDefinitionRefState, documentState } from '../../models/atoms';
import { useRecoilValue } from 'recoil';

type Props = {
  openApiType: OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject;
};

const context: TypeHierarchyContext = {
  resolveRef: () => undefined,
  visitedRefs: [],
  renderType: TypeCard,
  renderTypeRefLink: TypeRefLink,
  renderPrimitiveType: PrimitiveTypeCard,
  renderArrayType: ArrayTypeCard,
  renderAssociativeArrayType: AssociativeArrayTypeCard,
  renderObjectType: ObjectTypeCard,
  renderNullType: PrimitiveTypeCard,
  renderAnyType: AnyTypeCard,
  renderUndefinedType: UndefinedTypeCard,
  renderComments: () => <></>,
  onRefClick: () => {}
};

export const DeepTypeCard = (props: Props): JSX.Element => {
  const { openApiType } = props;

  const document = useRecoilValue(documentState);
  const setSelectedTypeDefinitionRef = useSetRecoilState(selectedTypeDefinitionRefState);

  const resolveRef = ($ref: string) => {
    const schemaObject = document?.typeReferences[$ref];
    return schemaObject && schemaObject.type ? schemaObject : undefined;
  };
  
  const onRefClick = ($ref: string) => {
    setSelectedTypeDefinitionRef($ref);
  };

  const deepContext = {...context, resolveRef, onRefClick};

  return context.renderType({ context: deepContext, openApiType });
};
