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

export type BACKWARD = BACKWARD.INIT | BACKWARD.SUCC | BACKWARD.FAIL;
export namespace BACKWARD {
    export const INIT = 'BACKWARD.INIT';
    export type INIT = string;

    export const SUCC = 'BACKWARD.SUCC';
    export type SUCC = LanguageSection[];

    export const FAIL = 'BACKWARD.FAIL';
    export type FAIL = {
        err: Error,
        current: string
    };
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

export const backward = (dispatch: any, getState: () => State) => {
    const init = createAction<string, BACKWARD.INIT>(BACKWARD.INIT);
    const succ = createAction<LanguageSection[], BACKWARD.SUCC>(BACKWARD.SUCC);
    const fail = createAction<{
        err: Error,
        current: string
    }, BACKWARD.FAIL>(BACKWARD.FAIL);

    const history = getState().history;
    const target = lastTarget(history);
    dispatch(init(target));
    fetch(target).then(
        res => dispatch(succ(parse(res))),
        err => dispatch(fail({
            err: err,
            current: getState().word
        }))
    );
}

export function lastTarget(history: string[]): string {
    if (history.length >= 2) {
        return history[history.length - 2];
    } else {
        return null;
    }
}
