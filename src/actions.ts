import * as Promise from 'bluebird'
import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section, BlockElem, LanguageSection } from './types';
import parse from './chrome/parser';
import { fetch } from './util';

export type LOOKUP = LOOKUP.INIT | LOOKUP.SUCC | LOOKUP.FAIL;
export namespace LOOKUP {
    export const INIT = 'LOOKUP.INIT';
    export type INIT = string;

    export const SUCC = 'LOOKUP.SUCC';
    export type SUCC = LanguageSection[];

    export const FAIL = 'LOOKUP.FAIL';
    export type FAIL = Error;
}

export type NAV = NAV.BACKWARD | NAV.SEARCH;
export namespace NAV {
    // akin to random walk
    export const SEARCH = 'NAV.SEARCH';
    export type SEARCH = string;

    export const BACKWARD = 'NAV.BACKWARD';
    export type BACKWARD = void;
}

export const lookup = (target: string) => (dispatch: any) => {
    const init = createAction<string, LOOKUP.INIT>(LOOKUP.INIT);
    const succ = createAction<LanguageSection[], LOOKUP.SUCC>(LOOKUP.SUCC);
    const fail = createAction<Error, LOOKUP.FAIL>(LOOKUP.FAIL);

    dispatch(init(target));
    fetch(target).then(
        res => dispatch(succ(parse(res))),
        err => dispatch(fail(err))
    );
}

// // navigation
// export const navBackward = createAction<NAV.BACKWARD>(NAV.BACKWARD);
//
//
// export const backward = (dispatch: any, getState: () => State) => {
//     const state = getState();
//     const target = lastTarget(state.history);
//     if (target) {
//         dispatch(navBackward);
//         dispatch(lookup.init(target));
//         fetch(target).then(
//             res => dispatch(render(parse(res))),
//             err => dispatch(error(err))
//         );
//     }
// }

// export const backward = createAction<Error, LOOKUP.FAIL>(LOOKUP.FAIL, err => ({ err }));
// export const backward = (word: string) => (dispatch: any) => {
//     dispatch(lookup(word));
//     fetch(word).then(
//         res => {
//             dispatch(render(parse(res)))
//         },
//         err => dispatch(lookup(word))
//     );
// }


export function lastTarget(history: string[]): string {
    if (history.length >= 2) {
        return history[history.length - 2];
    } else {
        return null;
    }
}
