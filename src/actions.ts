import * as Promise from 'bluebird'
import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section, BlockElem, LanguageSection } from './types';
import parse from './chrome/parser';
import { fetch } from './util';

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
    body: LanguageSection[]
};

export const SEARCH_ERROR = 'SEARCH_ERROR';
export type SEARCH_ERROR = {
    err: Error
};

export const jump = createAction<string, JUMP>(JUMP, word => ({ word }));
export const parseError = createAction<any, PARSE_ERROR>(PARSE_ERROR, error => ({ error }));
export const render = createAction<LanguageSection[], RENDER>(RENDER, body => ({ body }));
export const searchError = createAction<Error, SEARCH_ERROR>(SEARCH_ERROR, err => ({ err }));
export const search = (word: string) => (dispatch: any) => fetch(word)
    .then(
        res => {
            dispatch(jump(word))
            // const blockSections: Section<BlockElem[]> = parse(res);
            dispatch(render(parse(res)))
        },
        err => dispatch(searchError(err))
    )
