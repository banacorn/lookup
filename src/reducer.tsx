import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: ':D',
    body: []
}

function handleRender(state: State, action: Action<LOOKUP.SUCCESS>): State {
    return _.assign({}, state, {
        body: action.payload.body
    });
}



export default handleActions<State, LOOKUP>({
    [LOOKUP.REQUEST]: (state: State, action: Action<LOOKUP.REQUEST>) => _.assign({}, state, {
        word: action.payload.word
    }),
    [LOOKUP.SUCCESS]: (state: State, action: Action<LOOKUP.SUCCESS>) => _.assign({}, state, {
        body: action.payload.body
    })
    // [LOOKUP.FAILURE]: (state: State, action: Action<LOOKUP.FAILURE>) => _.assign({}, state, {
    //     word: action.payload.word
    // }),
}, defaultState);
