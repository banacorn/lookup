import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP, BACKWARD, lastTarget } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],
    status: 'pending',
    history: []
}

const lookupReducers = handleActions<State, LOOKUP | BACKWARD>({
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


    [BACKWARD.INIT]: (state: State, action: Action<BACKWARD.INIT>) => _.assign({}, state, {
        word: action.payload,
        status: 'pending',
        history: _.initial(state.history)
    }),
    [BACKWARD.SUCC]: (state: State, action: Action<BACKWARD.SUCC>) => _.assign({}, state, {
        body: action.payload,
        status: 'succeed'
    }),
    [BACKWARD.FAIL]: (state: State, action: Action<BACKWARD.FAIL>) => _.assign({}, state, {
        // rewind
        word: action.payload.current,
        status: 'failed',
        history: _.concat(state.history, action.payload.current)
    }),
}, defaultState);

const backwardReducers = handleActions<State, BACKWARD>({
}, defaultState);

export default lookupReducers
// export default combineReducers({
//   lookupReducers,
//   backwardReducers
// })
