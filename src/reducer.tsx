import * as _ from 'lodash';
import { State } from './types';
import { FETCH, STATUS, LOOKUP, BACKWARD, lastTarget } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],
    status: 'pending',
    history: []
}

export default handleActions<State, FETCH | STATUS | LOOKUP | BACKWARD>({
    [FETCH.INIT]: (state: State, action: Action<FETCH.INIT>) => _.assign({}, state, {
        word: action.payload
    }),
    [FETCH.SUCC]: (state: State, action: Action<FETCH.SUCC>) => _.assign({}, state, {
        body: action.payload
    }),


    [STATUS.INIT]: (state: State, action: Action<STATUS.INIT>) => _.assign({}, state, {
        status: 'pending'
    }),
    [STATUS.SUCC]: (state: State, action: Action<STATUS.SUCC>) => _.assign({}, state, {
        status: 'succeed'
    }),
    [STATUS.FAIL]: (state: State, action: Action<STATUS.FAIL>) => _.assign({}, state, {
        status: 'failed'
    }),


    [LOOKUP.INIT]: (state: State, action: Action<LOOKUP.INIT>) => _.assign({}, state, {
        history: _.concat(state.history, action.payload)
    }),
    [LOOKUP.FAIL]: (state: State, action: Action<LOOKUP.FAIL>) => _.assign({}, state, {
        history: _.initial(state.history)
    }),

    [BACKWARD.INIT]: (state: State, action: Action<BACKWARD.INIT>) => _.assign({}, state, {
        history: _.initial(state.history)
    }),
    [BACKWARD.FAIL]: (state: State, action: Action<BACKWARD.FAIL>) => _.assign({}, state, {
        history: _.concat(state.history, action.payload.current)
    }),
}, defaultState);
