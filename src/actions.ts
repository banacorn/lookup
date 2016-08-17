import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State } from './types';

export const JUMP = 'JUMP';
export type JUMP = {
    word: string
};
export const RENDER = 'RENDER';
export type RENDER = {
    body: string
};

let b = createAction;


export const jump = createAction<string, JUMP>(JUMP, (s: string) => ({
    word: s
}));

export const render = createAction<string, RENDER>(RENDER, (s: string) => ({
    body: s
}));
