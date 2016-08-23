import * as _ from 'lodash';
import { State, Entry, Status, History } from './types';
import { FETCH, STATUS, LOOKUP, BACKWARD, FORWARD, lastTarget } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    entry: {
        word: '',
        body: []
    },
    status: 'pending',
    history: {
        present: {
            words: [],
            cursor: null
        },
        past: {
            words: [],
            cursor: null
        }
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

const history = handleActions<{present: History, past: History}, LOOKUP | BACKWARD>({
    [LOOKUP.INIT]: (state: {present: History, past: History}, action: Action<LOOKUP.INIT>) => {
        const backup = state.present;

        const nextWord = state.present.words[state.present.cursor + 1];
        // history forked
        if (nextWord && nextWord !== action.payload) {
            return {
                past: backup,
                present: {
                    words: _.concat(_.take(state.present.words, state.present.cursor + 1), action.payload),
                    cursor: state.present.cursor + 1
                }
            }
        } else {
            return {
                past: backup,
                present: {
                    words: _.concat(state.present.words, action.payload),
                    cursor: state.present.words.length
                }
            };
        }
    },
    [LOOKUP.FAIL]: (state: {present: History, past: History}, action: Action<LOOKUP.FAIL>) => _.assign({}, state, {
        present: state.past
    }),

    [BACKWARD.INIT]: (state: {present: History, past: History}, action: Action<BACKWARD.INIT>) => {
        const backup = state.present;
        return {
            past: backup,
            present: {
                words: state.present.words,
                cursor: _.max([state.present.cursor - 1, 0])
            }
        }
    },
    [BACKWARD.FAIL]: (state: {present: History, past: History}, action: Action<BACKWARD.FAIL>) => _.assign({}, state, {
        present: state.past
    }),


    [FORWARD.INIT]: (state: {present: History, past: History}, action: Action<FORWARD.INIT>) => {
        const backup = state.present;
        return {
            past: backup,
            present: {
                words: state.present.words,
                cursor: state.present.cursor + 1
            }
        }
    },
    [FORWARD.FAIL]: (state: {present: History, past: History}, action: Action<FORWARD.FAIL>) => _.assign({}, state, {
        present: state.past
    })
}, defaultState.history);

export default combineReducers({
    entry,
    status,
    history
})
