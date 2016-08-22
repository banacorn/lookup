import * as Promise from 'bluebird'
import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section, BlockElem, LanguageSection } from './types';
import parse from './chrome/parser';
import { fetch } from './util';

export type LOOKUP = LOOKUP.REQUEST | LOOKUP.SUCCESS | LOOKUP.FAILURE;
export namespace LOOKUP {
    export const REQUEST = 'LOOKUP.REQUEST';
    export type REQUEST = string;

    export const SUCCESS = 'LOOKUP.SUCCESS';
    export type SUCCESS = LanguageSection[];

    export const FAILURE = 'LOOKUP.FAILURE';
    export type FAILURE = Error;
}

export type NAV = NAV.BACKWARD | NAV.SEARCH;
export namespace NAV {
    // akin to random walk
    export const SEARCH = 'NAV.SEARCH';
    export type SEARCH = string;

    export const BACKWARD = 'NAV.BACKWARD';
    export type BACKWARD = void;
}

// lookup
export const lookup = createAction<string, LOOKUP.REQUEST>(LOOKUP.REQUEST);
export const render = createAction<LanguageSection[], LOOKUP.SUCCESS>(LOOKUP.SUCCESS);
export const error = createAction<Error, LOOKUP.FAILURE>(LOOKUP.FAILURE);

// navigation
export const navSearch = createAction<string, NAV.SEARCH>(NAV.SEARCH);

export const search = (target: string) => (dispatch: any) => {
    dispatch(navSearch(target));
    dispatch(lookup(target));
    fetch(target).then(
        res => dispatch(render(parse(res))),
        err => dispatch(error(err))
    );
}


// export const backward = createAction<Error, LOOKUP.FAILURE>(LOOKUP.FAILURE, err => ({ err }));
// export const backward = (word: string) => (dispatch: any) => {
//     dispatch(lookup(word));
//     fetch(word).then(
//         res => {
//             dispatch(render(parse(res)))
//         },
//         err => dispatch(lookup(word))
//     );
// }
