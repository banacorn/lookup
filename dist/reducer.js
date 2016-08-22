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
    _a[actions_1.FETCH.INIT] = function (state, action) { return _.assign({}, state, {
        word: action.payload
    }); },
    _a[actions_1.FETCH.SUCC] = function (state, action) { return _.assign({}, state, {
        body: action.payload
    }); },
    _a[actions_1.STATUS.INIT] = function (state, action) { return _.assign({}, state, {
        status: 'pending'
    }); },
    _a[actions_1.STATUS.SUCC] = function (state, action) { return _.assign({}, state, {
        status: 'succeed'
    }); },
    _a[actions_1.STATUS.FAIL] = function (state, action) { return _.assign({}, state, {
        status: 'failed'
    }); },
    _a[actions_1.LOOKUP.INIT] = function (state, action) { return _.assign({}, state, {
        history: _.concat(state.history, action.payload)
    }); },
    _a[actions_1.LOOKUP.FAIL] = function (state, action) { return _.assign({}, state, {
        history: _.initial(state.history)
    }); },
    _a[actions_1.BACKWARD.INIT] = function (state, action) { return _.assign({}, state, {
        history: _.initial(state.history)
    }); },
    _a[actions_1.BACKWARD.FAIL] = function (state, action) { return _.assign({}, state, {
        history: _.concat(state.history, action.payload.current)
    }); },
    _a
), defaultState);
var _a;
//# sourceMappingURL=reducer.js.map