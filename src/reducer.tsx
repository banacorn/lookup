import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP, NAV, lastTarget } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],

    status: 'pending',
    history: []
}

export default handleActions<State, LOOKUP | NAV>({
    [LOOKUP.INIT]: (state: State, action: Action<LOOKUP.INIT>) => _.assign({}, state, {
        // display the target right away
        word: action.payload,
        status: 'pending',
        history: _.concat(state.history, action.payload)
    }),
    [LOOKUP.SUCC]: (state: State, action: Action<LOOKUP.SUCC>) => _.assign({}, state, {
        body: action.payload,
        status: 'succeed'
    }),
    [LOOKUP.FAIL]: (state: State, action: Action<LOOKUP.FAIL>) => _.assign({}, state, {
        // rewind
        word: lastTarget(state.history),
        status: 'failed',
        history: _.initial(state.history)
    }),
}, defaultState);
