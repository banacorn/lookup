import * as _ from 'lodash';
import { State } from './types';
import { JUMP, RENDER } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: ':D',
    body: []
}

function handleRender(state: State, action: Action<RENDER>): State {
    console.log(action.payload.body)
    return _.assign({}, state, {
        body: action.payload.body
    });
}

export default handleActions<State, JUMP | RENDER>({
    [JUMP]: (state: State, action: Action<JUMP>) => _.assign({}, state, {
        word: action.payload.word
    }),
    [RENDER]: handleRender
}, defaultState);
