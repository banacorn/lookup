import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section } from './types';

export const JUMP = 'JUMP';
export type JUMP = {
    word: string
};
export const PARSE_ERROR = 'PARSE_ERROR';
export type PARSE_ERROR = {
    error: any
};
export const RENDER = 'RENDER';
export type RENDER = {
    body: Section[]
};

let b = createAction;

export const jump = createAction<string, JUMP>(JUMP, word => ({ word }));
export const parseError = createAction<any, PARSE_ERROR>(PARSE_ERROR, error => ({ error }));
export const render = createAction<Section[], RENDER>(RENDER, body => ({ body }));
