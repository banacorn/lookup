"use strict";
var redux_actions_1 = require('redux-actions');
var parser_1 = require('./chrome/parser');
var util_1 = require('./util');
var FETCH;
(function (FETCH) {
    FETCH.INIT = 'FETCH.INIT';
    FETCH.SUCC = 'FETCH.SUCC';
    FETCH.FAIL = 'FETCH.FAIL';
})(FETCH = exports.FETCH || (exports.FETCH = {}));
var STATUS;
(function (STATUS) {
    STATUS.INIT = 'STATUS.INIT';
    STATUS.SUCC = 'STATUS.SUCC';
    STATUS.FAIL = 'STATUS.FAIL';
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var LOOKUP;
(function (LOOKUP) {
    LOOKUP.INIT = 'LOOKUP.INIT';
    LOOKUP.FAIL = 'LOOKUP.FAIL';
})(LOOKUP = exports.LOOKUP || (exports.LOOKUP = {}));
var BACKWARD;
(function (BACKWARD) {
    BACKWARD.INIT = 'BACKWARD.INIT';
    BACKWARD.FAIL = 'BACKWARD.FAIL';
})(BACKWARD = exports.BACKWARD || (exports.BACKWARD = {}));
var fetch;
(function (fetch) {
    fetch.init = redux_actions_1.createAction(FETCH.INIT);
    fetch.succ = redux_actions_1.createAction(FETCH.SUCC);
    fetch.fail = redux_actions_1.createAction(FETCH.FAIL);
})(fetch = exports.fetch || (exports.fetch = {}));
var status;
(function (status) {
    status.init = redux_actions_1.createAction(STATUS.INIT);
    status.succ = redux_actions_1.createAction(STATUS.SUCC);
    status.fail = redux_actions_1.createAction(STATUS.FAIL);
})(status = exports.status || (exports.status = {}));
var historyLookup;
(function (historyLookup) {
    historyLookup.init = redux_actions_1.createAction(LOOKUP.INIT);
    historyLookup.fail = redux_actions_1.createAction(LOOKUP.FAIL);
})(historyLookup = exports.historyLookup || (exports.historyLookup = {}));
var historyBackward;
(function (historyBackward) {
    historyBackward.init = redux_actions_1.createAction(BACKWARD.INIT);
    historyBackward.fail = redux_actions_1.createAction(BACKWARD.FAIL);
})(historyBackward = exports.historyBackward || (exports.historyBackward = {}));
exports.lookup = function (target) { return function (dispatch, getState) {
    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyLookup.init(target));
    util_1.fetch(target).then(function (res) {
        var result = parser_1.default(res);
        dispatch(fetch.succ(result));
        dispatch(status.succ());
    }, function (err) {
        dispatch(fetch.fail(err));
        dispatch(status.fail());
        dispatch(historyLookup.fail(err));
    });
}; };
exports.backward = function (dispatch, getState) {
    var history = getState().history;
    var target = lastTarget(history);
    dispatch(fetch.init(target));
    dispatch(status.init());
    dispatch(historyBackward.init(target));
    util_1.fetch(target).then(function (res) {
        var result = parser_1.default(res);
        dispatch(fetch.succ(result));
        dispatch(status.succ());
    }, function (err) {
        dispatch(fetch.fail(err));
        dispatch(status.fail());
        dispatch(historyBackward.fail({
            err: err,
            current: getState().entry.word
        }));
    });
};
function lastTarget(history) {
    if (history.length >= 2) {
        return history[history.length - 2];
    }
    else {
        return null;
    }
}
exports.lastTarget = lastTarget;
//# sourceMappingURL=actions.js.map