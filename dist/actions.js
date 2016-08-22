"use strict";
var redux_actions_1 = require('redux-actions');
var parser_1 = require('./chrome/parser');
var util_1 = require('./util');
var LOOKUP;
(function (LOOKUP) {
    LOOKUP.INIT = 'LOOKUP.INIT';
    LOOKUP.SUCC = 'LOOKUP.SUCC';
    LOOKUP.FAIL = 'LOOKUP.FAIL';
})(LOOKUP = exports.LOOKUP || (exports.LOOKUP = {}));
var NAV;
(function (NAV) {
    NAV.SEARCH = 'NAV.SEARCH';
    NAV.BACKWARD = 'NAV.BACKWARD';
})(NAV = exports.NAV || (exports.NAV = {}));
exports.lookup = function (target) { return function (dispatch) {
    var init = redux_actions_1.createAction(LOOKUP.INIT);
    var succ = redux_actions_1.createAction(LOOKUP.SUCC);
    var fail = redux_actions_1.createAction(LOOKUP.FAIL);
    dispatch(init(target));
    util_1.fetch(target).then(function (res) { return dispatch(succ(parser_1.default(res))); }, function (err) { return dispatch(fail(err)); });
}; };
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