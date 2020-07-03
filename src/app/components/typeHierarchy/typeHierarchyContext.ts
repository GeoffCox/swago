import { OpenAPIV2 } from 'openapi-types';

type TypeRenderProps<T> = {
  context: TypeHierarchyContext;
  openApiType: T;
};

type TypeRender<T> = (props: TypeRenderProps<T>) => JSX.Element;

type TypeCommentsRenderProps<T> = TypeRenderProps<T> & {
  name: string;
  required?: boolean;
};

type TypeCommentsRender<T> = (props: TypeCommentsRenderProps<T>) => JSX.Element;

export type TypeHierarchyContext = {
  resolveRef: ($ref: string) => OpenAPIV2.SchemaObject | undefined;  
  visitedRefs: string[];
  resolvedRef?: string;
  suffix?: string;

  renderType: TypeRender<OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject>;
  renderTypeRefLink: TypeRender<string>;
  renderPrimitiveType: TypeRender<OpenAPIV2.SchemaObject>;
  renderArrayType: TypeRender<OpenAPIV2.ItemsObject>;
  renderAssociativeArrayType: TypeRender<OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject>;
  renderObjectType: TypeRender<OpenAPIV2.SchemaObject>;
  renderNullType: TypeRender<OpenAPIV2.SchemaObject>;
  renderAnyType: TypeRender<OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject>;
  renderUndefinedType: TypeRender<OpenAPIV2.ReferenceObject | OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject>;
  renderComments: TypeCommentsRender<OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject>;

  onRefClick: ($ref: string, name: string) => void;
};
