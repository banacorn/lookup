import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP, NAV } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],

    status: 'pending',
    history: []
}

function lastTarget(history: string[]): string {
    if (history.length >= 2) {
        return history[history.length - 2];
    } else {
        return null;
    }
}

export default handleActions<State, LOOKUP | NAV>({
    [LOOKUP.REQUEST]: (state: State, action: Action<LOOKUP.REQUEST>) => _.assign({}, state, {
        // display the target right away
        word: action.payload,
        status: 'pending'
    }),
    [LOOKUP.SUCCESS]: (state: State, action: Action<LOOKUP.SUCCESS>) => _.assign({}, state, {
        body: action.payload,
        status: 'succeed'
    }),
    [LOOKUP.FAILURE]: (state: State, action: Action<LOOKUP.FAILURE>) => _.assign({}, state, {
        // rewind
        word: lastTarget(state.history),
        status: 'failed',
        history: _.initial(state.history)
    }),

    // navigation
    [NAV.SEARCH]: (state: State, action: Action<NAV.SEARCH>) => _.assign({}, state, {
        history: _.concat(state.history, action.payload)
    })
}, defaultState);
