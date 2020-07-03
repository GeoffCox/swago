import { OpenAPIV2 } from 'openapi-types';

/* Gets comment for ItemsObject  OpenAPIV2.ItemsObject
   Does not include:
        - type
        - items
        - enum
 */
export const getItemsObjectComments = (item: OpenAPIV2.ItemsObject) => {
  const comments: string[] = [];

  // default
  item.default && comments.push(`default: ${JSON.stringify(item.default)}`);

  // format
  item.format && comments.push(`format: ${item.format}`);
  item.collectionFormat && comments.push(`collectionFormat: ${item.collectionFormat}`);
  item.pattern && comments.push(`pattern: ${item.pattern}`);

  // cardinality
  item.uniqueItems !== undefined && comments.push(`uniqueItems: ${item.uniqueItems}`);
  item.multipleOf !== undefined && comments.push(`multipleOf: ${item.multipleOf}`);

  if (item.minimum || item.maximum) {
    const leftBracket = item.exclusiveMinimum ? '[' : '(';
    const rightBracket = item.exclusiveMaximum ? ']' : ')';

    comments.push(`min/max: ${leftBracket}${item.minimum} - ${item.maximum}${rightBracket}`);
  }

  if (item.minLength || item.maxLength) {
    comments.push(`min/max length: ${item.minLength} - ${item.maxLength}`);
  }

  if (item.minItems || item.maxItems) {
    comments.push(`min/max items: ${item.minItems} - ${item.maxItems}`);
  }

  return comments;
};

/* Gets comment for OpenAPIV2.SchemaObject
   Does not include:         
        - type
        - required (string[])
        - items
        - additionalItems
        - enum
        - $schema
        - xml
        - properties
        - additionalProperties
        - patternProperties
        - dependencies
        - allOf, anyOf, oneOf, not   
 */
export const getSchemaObjectComments = (item: OpenAPIV2.SchemaObject) => {
  const comments: string[] = [];

  // identity
  item.id && comments.push(`id: ${item.id}`);
  item.discriminator && comments.push(`discriminator: ${item.discriminator}`);

  // title, description
  item.title && comments.push(`title: ${item.title}`);
  item.description && comments.push(`description: ${item.description}`);

  // required, default
  item.default && comments.push(`default: ${JSON.stringify(item.default)}`);

  // format
  item.readOnly !== undefined && comments.push(`readOnly: ${item.readOnly}`);
  item.format && comments.push(`format: ${item.format}`);
  item.pattern && comments.push(`pattern: ${item.pattern}`);

  item.example && comments.push(`example: ${JSON.stringify(item.example)}`);
  item.externalDocs && comments.push(`externalDocs: ${item.externalDocs.description} ${item.externalDocs.url}`);

  // cardinality
  item.uniqueItems !== undefined && comments.push(`uniqueItems: ${item.uniqueItems}`);
  item.multipleOf !== undefined && comments.push(`multipleOf: ${item.multipleOf}`);

  if (item.minimum || item.maximum) {
    const leftBracket = item.exclusiveMinimum ? '[' : '(';
    const rightBracket = item.exclusiveMaximum ? ']' : ')';

    comments.push(`min/max: ${leftBracket}${item.minimum} - ${item.maximum}${rightBracket}`);
  }

  if (item.minLength || item.maxLength) {
    comments.push(`min/max length: ${item.minLength} - ${item.maxLength}`);
  }

  if (item.minItems || item.maxItems) {
    comments.push(`min/max items: ${item.minItems} - ${item.maxItems}`);
  }

  return comments;
};

/* Gets comments for OpenAPIV2.ParameterObject
   Does not include:         
        - in
        - loose properties
 */
export const getParameterObjectComments = (item: OpenAPIV2.ParameterObject) => {
  const comments: string[] = [];

  // name, description
  comments.push(item.name);
  comments.push('-'.repeat(item.name.length));
  item.description && comments.push(`description: ${item.description}`);

  // required, default
  item.required !== undefined && comments.push(`required: ${item.required}`);

  // other properties
  Object.keys(item).forEach(k => {
    switch (k) {
      case 'name':
      case 'description':
      case 'required':
      case 'in':
      case 'schema':
        break;
      default:
        comments.push(`${k}: ${item[k]}`);
        break;
    }
  });

  return comments;
};

/* Gets comments for OpenAPIV2.Parameter
   Does not include:         
        - in
        - fields not included with getItemsObjectComments
        - loose properties
 */
export const getParameterComments = (item: OpenAPIV2.Parameter) => {
  const comments: string[] = [];

  // ParameterObject
  comments.push(...getParameterObjectComments(item));

  // GeneralParameterObject
  const generalParam = item as OpenAPIV2.GeneralParameterObject;
  if (generalParam.type) {
    item.allowEmptyValue !== undefined && comments.push(`allowEmptyValue: ${item.allowEmptyValue}`);

    comments.push(...getItemsObjectComments(generalParam));
  }

  return comments;
};
