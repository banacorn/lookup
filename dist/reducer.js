"use strict";
var _ = require('lodash');
var actions_1 = require('./actions');
var redux_1 = require('redux');
var redux_actions_1 = require('redux-actions');
var defaultState = {
    entry: {
        word: '',
        body: []
    },
    status: 'pending',
    history: {
        words: [],
        cursor: null
    }
};
var entry = redux_actions_1.handleActions((_a = {},
    _a[actions_1.FETCH.INIT] = function (state, action) { return _.assign({}, state, {
        word: action.payload,
        body: state.body
    }); },
    _a[actions_1.FETCH.SUCC] = function (state, action) { return _.assign({}, state, {
        word: state.word,
        body: action.payload
    }); },
    _a
), defaultState.entry);
var status = redux_actions_1.handleActions((_b = {},
    _b[actions_1.STATUS.INIT] = function (state, action) { return 'pending'; },
    _b[actions_1.STATUS.SUCC] = function (state, action) { return 'succeed'; },
    _b[actions_1.STATUS.FAIL] = function (state, action) { return 'failed'; },
    _b
), defaultState.status);
var history = redux_actions_1.handleActions((_c = {},
    _c[actions_1.LOOKUP.INIT] = function (state, action) {
        var nextWord = state.words[state.cursor + 1];
        if (nextWord && nextWord !== action.payload) {
            return {
                words: _.concat(_.take(state.words, state.cursor + 1), action.payload),
                cursor: state.cursor + 1
            };
        }
        else {
            return {
                words: _.concat(state.words, action.payload),
                cursor: state.words.length
            };
        }
    },
    _c[actions_1.LOOKUP.FAIL] = function (state, action) { return _.assign({}, state, {
        words: _.initial(state.words),
        cursor: state.cursor - 1
    }); },
    _c[actions_1.BACKWARD.INIT] = function (state, action) { return _.assign({}, state, {
        cursor: state.cursor - 1
    }); },
    _c[actions_1.BACKWARD.FAIL] = function (state, action) { return _.assign({}, state, {
        cursor: state.cursor + 1
    }); },
    _c[actions_1.FORWARD.INIT] = function (state, action) { return _.assign({}, state, {
        cursor: state.cursor + 1
    }); },
    _c[actions_1.FORWARD.FAIL] = function (state, action) { return _.assign({}, state, {
        cursor: state.cursor - 1
    }); },
    _c
), defaultState.history);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_1.combineReducers({
    entry: entry,
    status: status,
    history: history
});
var _a, _b, _c;
//# sourceMappingURL=reducer.js.map