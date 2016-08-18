import * as _ from 'lodash';
import { State } from '../types';
import { JUMP, RENDER } from '../actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: ':D',
    body: ':D'
}

function handleRender(state: State, action: Action<RENDER>): State {
    console.log(action.payload.body.html.body[0].div[2].div[2].div[3])
    // console.log(action.payload.body)
    return _.assign({}, state, {
        body: JSON.stringify(action.payload.body.html.body[0].div[2].div[2].div[3])
        // body: JSON.stringify(action.payload.body)
    });
}

export default handleActions<State, JUMP | RENDER>({
    [JUMP]: (state: State, action: Action<JUMP>) => _.assign({}, state, {
        word: action.payload.word
    }),
    [RENDER]: handleRender
}, defaultState);
