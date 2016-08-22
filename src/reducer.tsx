import * as _ from 'lodash';
import { State, Entry, Status, History } from './types';
import { FETCH, STATUS, LOOKUP, BACKWARD, lastTarget } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    entry: {
        word: '',
        body: []
    },
    status: 'pending',
    history: {
        words: [],
        cursor: null
    }
}

const entry = handleActions<Entry, FETCH>({
    [FETCH.INIT]: (state: Entry, action: Action<FETCH.INIT>) => _.assign({}, state, {
        word: action.payload,
        body: state.body
    }),
    [FETCH.SUCC]: (state: Entry, action: Action<FETCH.SUCC>) => _.assign({}, state, {
        word: state.word,
        body: action.payload
    })
}, defaultState.entry);

const status = handleActions<Status, STATUS>({
    [STATUS.INIT]: (state: Status, action: Action<STATUS.INIT>) => 'pending',
    [STATUS.SUCC]: (state: Status, action: Action<STATUS.SUCC>) => 'succeed',
    [STATUS.FAIL]: (state: Status, action: Action<STATUS.FAIL>) => 'failed'
}, defaultState.status);

const history = handleActions<History, LOOKUP | BACKWARD>({
    [LOOKUP.INIT]: (state: History, action: Action<LOOKUP.INIT>) => _.assign({}, state, {
        words: _.concat(state.words, action.payload)
    }),
    [LOOKUP.FAIL]: (state: History, action: Action<LOOKUP.FAIL>) => _.assign({}, state, {
        words: _.initial(state.words)
    }),

    [BACKWARD.INIT]: (state: History, action: Action<BACKWARD.INIT>) => _.assign({}, state, {
        words: _.initial(state.words)
    }),
    [BACKWARD.FAIL]: (state: History, action: Action<BACKWARD.FAIL>) => _.assign({}, state, {
        words: _.concat(state.words, action.payload.current)
    })
}, defaultState.history);

export default combineReducers({
    entry,
    status,
    history
})
