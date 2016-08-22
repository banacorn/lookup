import * as _ from 'lodash';
import { State } from './types';
import { LOOKUP } from './actions';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions, Action } from 'redux-actions';

const defaultState: State = {
    word: '',
    body: [],
    nav: {
        target: null,
        status: 'pending',
        history: []
    }
}

export default handleActions<State, LOOKUP>({
    [LOOKUP.REQUEST]: (state: State, action: Action<LOOKUP.REQUEST>) => _.assign({}, state, {
        nav: {
            word: action.payload.word,
            status: 'pending',
            history: _.concat(state.nav.history, [action.payload.word])
        }
    }),
    [LOOKUP.SUCCESS]: (state: State, action: Action<LOOKUP.SUCCESS>) => _.assign({}, state, {
        word: state.nav.target,
        body: action.payload.body,
        nav: {
            target: state.nav.target,
            status: 'succeed',
            history: state.nav.history
        }
    }),
    [LOOKUP.FAILURE]: (state: State, action: Action<LOOKUP.FAILURE>) => _.assign({}, state, {
        nav: {
            target: state.nav.target,
            status: 'failed',
            history: _.initial(state.nav.history)
        }
    })
}, defaultState);
