import * as Promise from 'bluebird'
import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section, BlockElem, LanguageSection, History } from './types';
import parse from './chrome/parser';
import { fetch as fetchEntry } from './util';


export type FETCH = FETCH.INIT | FETCH.SUCC | FETCH.FAIL;
export namespace FETCH {
    export const INIT = 'FETCH.INIT';
    export type INIT = string;

    export const SUCC = 'FETCH.SUCC';
    export type SUCC = LanguageSection[];

    export const FAIL = 'FETCH.FAIL';
    export type FAIL = Error;
}

export type STATUS = STATUS.INIT | STATUS.SUCC | STATUS.FAIL;
export namespace STATUS {
    export const INIT = 'STATUS.INIT';
    export type INIT = void;

    export const SUCC = 'STATUS.SUCC';
    export type SUCC = void;

    export const FAIL = 'STATUS.FAIL';
    export type FAIL = void;
}

export type LOOKUP = LOOKUP.INIT | LOOKUP.FAIL;
export namespace LOOKUP {
    export const INIT = 'LOOKUP.INIT';
    export type INIT = string;

    export const FAIL = 'LOOKUP.FAIL';
    export type FAIL = Error;
}

export type BACKWARD = BACKWARD.INIT | BACKWARD.FAIL;
export namespace BACKWARD {
    export const INIT = 'BACKWARD.INIT';
    export type INIT = string;

    export const FAIL = 'BACKWARD.FAIL';
    export type FAIL = {
        err: Error,
        current: string
    };
}

export namespace fetch {
    export const init = createAction<string, FETCH.INIT>(FETCH.INIT);
    export const succ = createAction<LanguageSection[], FETCH.SUCC>(FETCH.SUCC);
    export const fail = createAction<Error, FETCH.FAIL>(FETCH.FAIL);
}

export namespace status {
    export const init = createAction(STATUS.INIT);
    export const succ = createAction(STATUS.SUCC);
    export const fail = createAction(STATUS.FAIL);
}

export namespace historyLookup {
    export const init = createAction<string, LOOKUP.INIT>(LOOKUP.INIT);
    export const fail = createAction<Error, LOOKUP.FAIL>(LOOKUP.FAIL);
}

export namespace historyBackward {
    export const init = createAction<string, BACKWARD.INIT>(BACKWARD.INIT);
    export const fail = createAction<{
        err: Error,
        current: string
    }, BACKWARD.FAIL>(BACKWARD.FAIL);
}

export const lookup = (target: string) => (dispatch: any, getState: () => State) => {
    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyLookup.init(target));
    fetchEntry(target).then(
        res => {
            const result = parse(res);
            dispatch(fetch.succ(result));
            dispatch(status.succ());
        },
        err => {
            dispatch(fetch.fail(err));
            dispatch(status.fail());
             dispatch(historyLookup.fail(err));
        }
    );
}

export const backward = (dispatch: any, getState: () => State) => {
    const history = getState().history;
    const target = lastTarget(history);

    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyBackward.init(target));
    fetchEntry(target).then(
        res => {
            const result = parse(res);
            dispatch(fetch.succ(result));
            dispatch(status.succ());
        },
        err => {
            dispatch(fetch.fail(err));
            dispatch(status.fail());
             dispatch(historyBackward.fail({
                err: err,
                current: getState().entry.word
            }));
        }
    )
}

export function lastTarget(history: History): string {
    if (history.words.length >= 2) {
        return history.words[history.words.length - 2];
    } else {
        return null;
    }
}
