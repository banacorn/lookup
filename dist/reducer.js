"use strict";
var _ = require('lodash');
var actions_1 = require('./actions');
var redux_actions_1 = require('redux-actions');
var defaultState = {
    word: '',
    body: [],
    lookup: {
        word: null,
        status: 'pending',
        history: []
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_actions_1.handleActions((_a = {},
    _a[actions_1.LOOKUP.REQUEST] = function (state, action) { return _.assign({}, state, {
        lookup: {
            word: action.payload.word,
            status: 'pending',
            history: state.lookup.history
        }
    }); },
    _a[actions_1.LOOKUP.SUCCESS] = function (state, action) { return _.assign({}, state, {
        word: state.lookup.word,
        body: action.payload.body,
        lookup: {
            word: state.lookup.word,
            status: 'succeed',
            history: _.concat(state.lookup.history, [state.lookup.word])
        }
    }); },
    _a[actions_1.LOOKUP.FAILURE] = function (state, action) { return _.assign({}, state, {
        lookup: {
            word: state.lookup.word,
            status: 'failed',
            history: state.lookup.history
        }
    }); },
    _a
), defaultState);
var _a;
//# sourceMappingURL=reducer.js.map