import * as Promise from 'bluebird'
import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section, BlockElem, LanguageSection } from './types';
import parse from './chrome/parser';
import { fetch } from './util';

export type LOOKUP = LOOKUP.REQUEST | LOOKUP.SUCCESS | LOOKUP.FAILURE;
export namespace LOOKUP {
    export const REQUEST = 'LOOKUP.REQUEST';
    export type REQUEST = {
        word: string
    };

    export const SUCCESS = 'LOOKUP.SUCCESS';
    export type SUCCESS = {
        body: LanguageSection[]
    };

    export const FAILURE = 'LOOKUP.FAILURE';
    export type FAILURE = {
        err: Error
    };
}

export const lookup = createAction<string, LOOKUP.REQUEST>(LOOKUP.REQUEST, word => ({ word }));
export const render = createAction<LanguageSection[], LOOKUP.SUCCESS>(LOOKUP.SUCCESS, body => ({ body }));
export const error = createAction<Error, LOOKUP.FAILURE>(LOOKUP.FAILURE, err => ({ err }));

export const search = (word: string) => (dispatch: any) => fetch(word)
    .then(
        res => {
            dispatch(lookup(word))
            dispatch(render(parse(res)))
        },
        err => dispatch(lookup(word))
    )
