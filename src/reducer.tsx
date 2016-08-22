import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],
    lookupStatus: 'pending'
}

export default handleActions<State, LOOKUP>({
    [LOOKUP.REQUEST]: (state: State, action: Action<LOOKUP.REQUEST>) => _.assign({}, state, {
        word: action.payload.word,
        lookupStatus: 'pending'
    }),
    [LOOKUP.SUCCESS]: (state: State, action: Action<LOOKUP.SUCCESS>) => _.assign({}, state, {
        body: action.payload.body,
        lookupStatus: 'succeed'
    }),
    [LOOKUP.FAILURE]: (state: State, action: Action<LOOKUP.FAILURE>) => _.assign({}, state, {
        lookupStatus: 'failed'
    })
}, defaultState);
