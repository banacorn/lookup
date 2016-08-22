"use strict";
var _ = require('lodash');
var actions_1 = require('./actions');
var redux_actions_1 = require('redux-actions');
var defaultState = {
    word: '',
    body: [],
    lookupStatus: 'pending'
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_actions_1.handleActions((_a = {},
    _a[actions_1.LOOKUP.REQUEST] = function (state, action) { return _.assign({}, state, {
        word: action.payload.word,
        lookupStatus: 'pending'
    }); },
    _a[actions_1.LOOKUP.SUCCESS] = function (state, action) { return _.assign({}, state, {
        body: action.payload.body,
        lookupStatus: 'succeed'
    }); },
    _a[actions_1.LOOKUP.FAILURE] = function (state, action) { return _.assign({}, state, {
        lookupStatus: 'failed'
    }); },
    _a
), defaultState);
var _a;
//# sourceMappingURL=reducer.js.map