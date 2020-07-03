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
import { CommentsCard } from '../typeHierarchy/CommentsCard';
import { useSetRecoilState } from 'recoil';
import { selectedTypeDefinitionRefState } from '../../models/atoms';

const context: TypeHierarchyContext = {
  resolveRef : () => undefined,
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
  renderComments: CommentsCard,
  onRefClick: () => {}
};

type Props = {
  openApiType: OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject;
};

export const FlatTypeCard = (props: Props): JSX.Element => {
  const { openApiType } = props;

  const setSelectedTypeDefinitionRef = useSetRecoilState(selectedTypeDefinitionRefState);

  const onRefClick = ($ref: string) => {        
    setSelectedTypeDefinitionRef($ref);
  };

  const deepContext = {...context, onRefClick};

  return context.renderType({ context: deepContext, openApiType });
};
