import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],
    lookup: {
        word: null,
        status: 'pending',
        history: []
    }
}

export default handleActions<State, LOOKUP>({
    [LOOKUP.REQUEST]: (state: State, action: Action<LOOKUP.REQUEST>) => _.assign({}, state, {
        lookup: {
            word: action.payload.word,
            status: 'pending',
            history: state.lookup.history
        }
    }),
    [LOOKUP.SUCCESS]: (state: State, action: Action<LOOKUP.SUCCESS>) => _.assign({}, state, {
        word: state.lookup.word,
        body: action.payload.body,
        lookup: {
            word: state.lookup.word,
            status: 'succeed',
            history: _.concat(state.lookup.history, [state.lookup.word])
        }
    }),
    [LOOKUP.FAILURE]: (state: State, action: Action<LOOKUP.FAILURE>) => _.assign({}, state, {
        lookup: {
            word: state.lookup.word,
            status: 'failed',
            history: state.lookup.history
        }
    })
}, defaultState);
