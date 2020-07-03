import { OpenAPIV2 } from 'openapi-types';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export type SwagoOperation = {
  readonly verb: HttpVerb;
  readonly operation: OpenAPIV2.OperationObject;
};

export type SwagoMethod = {
  readonly name: string;
  readonly path: string;
  readonly operations: readonly SwagoOperation[];
  readonly children: readonly SwagoMethod[];
  readonly pathItemObject: OpenAPIV2.PathItemObject;
};

export type SwagoTypeDefinition = {
  readonly name: string;
  readonly $ref: string;
  readonly schemaObject: OpenAPIV2.SchemaObject;
};

export type PathToSwagoMethodMap =  { readonly [key: string]: SwagoMethod };
export type RefToSwagoTypeDefinitionMap = { readonly [key: string]: SwagoTypeDefinition };
export type RefToSchemaObjectMap =  { readonly [key: string]: OpenAPIV2.SchemaObject };

export type SwagoDocument = {
  readonly title: string;
  readonly version: string;
  readonly location: string;
  readonly methods: readonly SwagoMethod[];
  readonly methodsByPath: PathToSwagoMethodMap;
  readonly typeDefinitions: readonly SwagoTypeDefinition[];
  readonly typeDefinitionsByRef: RefToSwagoTypeDefinitionMap;
  readonly typeReferences: RefToSchemaObjectMap;
};