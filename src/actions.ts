import * as Promise from 'bluebird'
import { createAction, handleAction, handleActions, Action } from 'redux-actions';
import { State, Section, BlockElem, LanguageSection, History } from './types';
import { fetchEntry } from './util';


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

export type FORWARD = FORWARD.INIT | FORWARD.FAIL;
export namespace FORWARD {
    export const INIT = 'FORWARD.INIT';
    export type INIT = string;

    export const FAIL = 'FORWARD.FAIL';
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
    export const fail = createAction<Error, BACKWARD.FAIL>(BACKWARD.FAIL);
}

export namespace historyForward {
    export const init = createAction<string, FORWARD.INIT>(FORWARD.INIT);
    export const fail = createAction<Error, FORWARD.FAIL>(FORWARD.FAIL);
}

export const lookup = (target: string) => (dispatch: any, getState: () => State) => {
    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyLookup.init(target));
    fetchEntry(target).then(
        res => {
            dispatch(fetch.succ(res));
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
    const target = lastTarget(history.present);

    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyBackward.init(target));
    fetchEntry(target).then(
        res => {
            dispatch(fetch.succ(res));
            dispatch(status.succ());
        },
        err => {
            dispatch(fetch.fail(err));
            dispatch(status.fail());
            dispatch(historyBackward.fail(err));
        }
    )
}

export const forward = (dispatch: any, getState: () => State) => {
    const history = getState().history;
    const target = nextTarget(history.present);

    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyForward.init(target));
    fetchEntry(target).then(
        res => {
            dispatch(fetch.succ(res));
            dispatch(status.succ());
        },
        err => {
            dispatch(fetch.fail(err));
            dispatch(status.fail());
            dispatch(historyForward.fail(err));
        }
    )
}

export function lastTarget(history: History): string {
    if (history.cursor >= 1) {
        return history.words[history.cursor - 1];
    } else {
        return null;
    }
}

export function nextTarget(history: History): string {
    if (history.cursor < history.words.length) {
        return history.words[history.cursor + 1];
    } else {
        return null;
    }
}
