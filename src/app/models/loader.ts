import * as SwaggerParser from 'swagger-parser';
import { OpenAPIV2 } from 'openapi-types';
import { SwagoMethod, SwagoDocument, SwagoOperation, SwagoTypeDefinition, RefToSchemaObjectMap, PathToSwagoMethodMap, RefToSwagoTypeDefinitionMap } from './types';

//-------------------- Swagger Operations --------------------

const getOperations = (pathItemObject: OpenAPIV2.PathItemObject): SwagoOperation[] => {
  const operations : SwagoOperation[] = [];

  // These are added in the standard order based on HttpVerb
  if (pathItemObject.get) {
    operations.push({verb: 'GET', operation: pathItemObject.get});
  } 
  if (pathItemObject.post) {
    operations.push({verb: 'POST', operation: pathItemObject.post});
  }
  if (pathItemObject.put) {
    operations.push({verb: 'PUT', operation: pathItemObject.put});
  }
  if (pathItemObject.patch) {
    operations.push({verb: 'PATCH', operation: pathItemObject.patch});
  }
  if (pathItemObject.delete) {
    operations.push({verb: 'DELETE', operation: pathItemObject.delete});
  }
  if (pathItemObject.options) {
    operations.push({verb: 'OPTIONS', operation: pathItemObject.options});
  }
  if (pathItemObject.head) {
    operations.push({verb: 'HEAD', operation: pathItemObject.head});
  }

  return operations;
};

//-------------------- Swagger Methods --------------------

type MutableSwagoMethod = {
  name: string;
  path: string;
  operations: SwagoOperation[];
  children: MutableSwagoMethod[];
  data?: OpenAPIV2.PathItemObject;
};

const addMethodChildren = (parts: string[], parent: MutableSwagoMethod, data: OpenAPIV2.PathItemObject) => {
  if (parts.length > 0) {
    const name = parts[0];

    const operations = getOperations(data).filter(o => o.operation !== undefined);

    const index = parent.children.findIndex((c) => c.name === name);
    let childNode = undefined;
    if (index === -1) {
      childNode = {
        name: name,
        path: `${parent.path}/${name}`,
        operations,
        children: [],
      };

      parent.children.push(childNode);
    } else {
      childNode = parent.children[index];
    }

    const newParts = parts.slice(1);
    if (newParts.length > 0) {
      addMethodChildren(newParts, childNode, data);
    } else {
      childNode.data = data;
    }
  }
};

const collapseMethods = (node: MutableSwagoMethod, parentNode: MutableSwagoMethod) => {
  if (node.data === undefined && node.children.length === 1) {
    const index = parentNode.children.findIndex((c) => c.path === node.path);
    if (index != -1) {
      const childNode = node.children[0];
      childNode.name = `${node.name}/${childNode.name}`;
      parentNode.children[index] = childNode;
    }
  }

  node.children.forEach((c) => collapseMethods(c, node));
};

const removeCurlyBraces = (value: string) => {
  return value.replace('{', '').replace('}', '');
};

const getMethods = (paths: OpenAPIV2.PathsObject): SwagoMethod[] => {
  const rootNode = {
    name: `API methods`,
    path: '',
    operations: [],
    children: [],
  };

  Object.keys(paths)
    .sort((a, b) => removeCurlyBraces(a).localeCompare(removeCurlyBraces(b)))
    .map((path: string) => {
      const pathParts = path.split('/').filter((p) => p.length > 0);
      addMethodChildren(pathParts, rootNode, paths[path]);
    });

  rootNode.children.forEach((c) => collapseMethods(c, rootNode));

  return <SwagoMethod[]>rootNode.children;
};

const addMethodsByPath = (method: SwagoMethod, map: { [key: string]: SwagoMethod }) => {
  map[method.path] = method;
  method.children.forEach((child) => addMethodsByPath(child, map));
};

const getMethodsByPath = (methods: SwagoMethod[]): PathToSwagoMethodMap => {
  const map: { [key: string]: SwagoMethod } = {};
  methods.forEach((method) => addMethodsByPath(method, map));
  return map;
};

//-------------------- Swagger Type Definitions --------------------

const getTypeDefinitions = (definitions: OpenAPIV2.DefinitionsObject): SwagoTypeDefinition[] => {
  return Object.keys(definitions)
    .sort()
    .map((name: string) => {
      return {
        name,
        $ref: `#/definitions/${name}`,
        schemaObject: definitions[name],
      };
    });
};

const getTypeDefinitionsByRef = (typeDefinitions: SwagoTypeDefinition[]): RefToSwagoTypeDefinitionMap => {
  const map: { [key: string]: SwagoTypeDefinition } = {};
  typeDefinitions.forEach((typeDefinition) => map[typeDefinition.$ref] = typeDefinition);
  return map;
};

//-------------------- Swagger References --------------------

const getTypeReferences = ($refs: SwaggerParser.$Refs): RefToSchemaObjectMap => {
  const result: { [key: string]: OpenAPIV2.SchemaObject } = {};
  $refs.paths().forEach((p) => {
    result[p] = $refs.get(p);
  });

  return <RefToSchemaObjectMap>result;
};

//-------------------- Swagger Documents --------------------

export const loadSwaggerDocument = async (file: string): Promise<SwagoDocument | undefined> => {
  const swagger = await SwaggerParser.parse(file);
  const swaggerDoc = swagger as OpenAPIV2.Document;
  const $refs = await SwaggerParser.resolve(swagger);

  if (swagger && swaggerDoc) {
    const methods = getMethods(swaggerDoc.paths);
    const methodsByPath = getMethodsByPath(methods);

    const typeDefinitions = swaggerDoc.definitions ? getTypeDefinitions(swaggerDoc.definitions) : [];
    const typeDefinitionsByRef = getTypeDefinitionsByRef(typeDefinitions);

    return {
      title: swagger.info.title,
      version: swagger.info.version,
      location: file,
      methods,
      methodsByPath,
      typeDefinitions,
      typeDefinitionsByRef: typeDefinitionsByRef,
      typeReferences: getTypeReferences($refs),
    };
  }

  return undefined;
};
