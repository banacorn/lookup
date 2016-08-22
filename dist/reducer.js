"use strict";
var _ = require('lodash');
var actions_1 = require('./actions');
var redux_actions_1 = require('redux-actions');
var defaultState = {
    word: '',
    body: [],
    nav: {
        word: null,
        status: 'pending',
        history: []
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_actions_1.handleActions((_a = {},
    _a[actions_1.LOOKUP.REQUEST] = function (state, action) { return _.assign({}, state, {
        nav: {
            word: action.payload.word,
            status: 'pending',
            history: state.nav.history
        }
    }); },
    _a[actions_1.LOOKUP.SUCCESS] = function (state, action) { return _.assign({}, state, {
        word: state.nav.word,
        body: action.payload.body,
        nav: {
            word: state.nav.word,
            status: 'succeed',
            history: _.concat(state.nav.history, [state.nav.word])
        }
    }); },
    _a[actions_1.LOOKUP.FAILURE] = function (state, action) { return _.assign({}, state, {
        nav: {
            word: state.nav.word,
            status: 'failed',
            history: state.nav.history
        }
    }); },
    _a
), defaultState);
var _a;
//# sourceMappingURL=reducer.js.map