import { selector } from 'recoil';
import { documentState, selectedMethodPathState, selectedOperationVerbState, selectedTypeDefinitionRefState } from './atoms';
import { SwagoMethod, SwagoOperation, SwagoTypeDefinition } from './types';

export const selectedMethodSelector = selector({
  key: 'selectedMethodSelector',
  get: ({ get }): SwagoMethod | undefined => {
    const document = get(documentState);
    const path = get(selectedMethodPathState);

    return document && path ? document.methodsByPath[path] : undefined;
  },
});

export const selectedOperationSelector = selector({
  key: 'selectedOperationSelector',
  get: ({ get }): SwagoOperation | undefined => {
    const method = get(selectedMethodSelector);
    const verb = get(selectedOperationVerbState);

    const found = method && verb ? method.operations.find((o) => o.verb === verb) : undefined;

    return found ?? (method && method.operations.length > 0 ? method.operations[0] : undefined);
  }
});

export const selectedTypeDefinitionSelector = selector({
  key: 'selectedTypeDefinitionSelector',
  get: ({ get }): SwagoTypeDefinition | undefined => {
    const document = get(documentState);
    const ref = get(selectedTypeDefinitionRefState);

    return document && ref ? document.typeDefinitionsByRef[ref] : undefined;
  },
});
