import * as _ from 'lodash';
import { State } from '../types';
import { JUMP, RENDER } from '../actions';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: ':D',
    body: ':D'
}

const reducer = handleActions({
    [JUMP]: (state: State, action: Action<State>) => _.assign({}, state, {
        word: action.payload.word
    }),
    [RENDER]: (state: State, action: Action<State>) => _.assign({}, state, {
        body: action.payload.body
    })
}, defaultState)

export default reducer
