import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],
    nav: {
        word: null,
        status: 'pending',
        history: []
    }
}

export default handleActions<State, LOOKUP>({
    [LOOKUP.REQUEST]: (state: State, action: Action<LOOKUP.REQUEST>) => _.assign({}, state, {
        nav: {
            word: action.payload.word,
            status: 'pending',
            history: state.nav.history
        }
    }),
    [LOOKUP.SUCCESS]: (state: State, action: Action<LOOKUP.SUCCESS>) => _.assign({}, state, {
        word: state.nav.word,
        body: action.payload.body,
        nav: {
            word: state.nav.word,
            status: 'succeed',
            history: _.concat(state.nav.history, [state.nav.word])
        }
    }),
    [LOOKUP.FAILURE]: (state: State, action: Action<LOOKUP.FAILURE>) => _.assign({}, state, {
        nav: {
            word: state.nav.word,
            status: 'failed',
            history: state.nav.history
        }
    })
}, defaultState);
