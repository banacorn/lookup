"use strict";
var _ = require('lodash');
var actions_1 = require('./actions');
var redux_actions_1 = require('redux-actions');
var defaultState = {
    word: '',
    body: [],
    status: 'pending',
    history: []
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_actions_1.handleActions((_a = {},
    _a[actions_1.LOOKUP.INIT] = function (state, action) { return _.assign({}, state, {
        word: action.payload,
        status: 'pending',
        history: _.concat(state.history, action.payload)
    }); },
    _a[actions_1.LOOKUP.SUCC] = function (state, action) { return _.assign({}, state, {
        body: action.payload,
        status: 'succeed'
    }); },
    _a[actions_1.LOOKUP.FAIL] = function (state, action) { return _.assign({}, state, {
        word: actions_1.lastTarget(state.history),
        status: 'failed',
        history: _.initial(state.history)
    }); },
    _a
), defaultState);
var _a;
//# sourceMappingURL=reducer.js.map