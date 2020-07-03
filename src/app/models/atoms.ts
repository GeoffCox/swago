import { atom } from 'recoil';
import { SwagoDocument, HttpVerb } from './types';

export const documentState = atom<SwagoDocument | undefined>({
    key: 'documentState',
    default: undefined
});

export const selectedMethodPathState = atom<string | undefined>({
    key: 'selectedMethodPathState',
    default: undefined
});

export const selectedOperationVerbState = atom<HttpVerb | undefined>({
    key: 'selectedOperationVerbState',
    default: undefined
});

export const selectedTypeDefinitionRefState = atom<string | undefined>({
    key: 'selectedTypeDefinitionRefState',
    default: undefined
});


