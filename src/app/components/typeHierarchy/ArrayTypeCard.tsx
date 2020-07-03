import { OpenAPIV2 } from 'openapi-types';
import { TypeHierarchyContext } from './typeHierarchyContext';

type Props = {
  context: TypeHierarchyContext;
  openApiType: OpenAPIV2.ItemsObject;
};

export const ArrayTypeCard = (props: Props): JSX.Element => {
  const { context, openApiType : items } = props;

  const itemsObject = items as OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject;
  const isItemsType = itemsObject.$ref || items.type;

  const suffix = context.suffix ? '[]'.concat(context.suffix) : '[]';
  const arrayContext = { ...context, suffix };

  if (isItemsType) {
    return context.renderType({ context: arrayContext, openApiType: itemsObject });
  } else {
    return context.renderAnyType({ context: arrayContext, openApiType: items });
  }
};
