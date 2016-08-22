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
function lastTarget(history) {
    if (history.length >= 2) {
        return history[history.length - 2];
    }
    else {
        return null;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_actions_1.handleActions((_a = {},
    _a[actions_1.LOOKUP.REQUEST] = function (state, action) { return _.assign({}, state, {
        word: action.payload,
        status: 'pending'
    }); },
    _a[actions_1.LOOKUP.SUCCESS] = function (state, action) { return _.assign({}, state, {
        body: action.payload,
        status: 'succeed'
    }); },
    _a[actions_1.LOOKUP.FAILURE] = function (state, action) { return _.assign({}, state, {
        word: lastTarget(state.history),
        status: 'failed',
        history: _.initial(state.history)
    }); },
    _a[actions_1.NAV.SEARCH] = function (state, action) { return _.assign({}, state, {
        history: _.concat(state.history, action.payload)
    }); },
    _a
), defaultState);
var _a;
//# sourceMappingURL=reducer.js.map