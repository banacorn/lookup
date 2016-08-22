"use strict";
var redux_actions_1 = require('redux-actions');
var parser_1 = require('./chrome/parser');
var util_1 = require('./util');
var LOOKUP;
(function (LOOKUP) {
    LOOKUP.REQUEST = 'LOOKUP.REQUEST';
    LOOKUP.SUCCESS = 'LOOKUP.SUCCESS';
    LOOKUP.FAILURE = 'LOOKUP.FAILURE';
})(LOOKUP = exports.LOOKUP || (exports.LOOKUP = {}));
var NAV;
(function (NAV) {
    NAV.SEARCH = 'NAV.SEARCH';
    NAV.BACKWARD = 'NAV.BACKWARD';
})(NAV = exports.NAV || (exports.NAV = {}));
exports.lookup = redux_actions_1.createAction(LOOKUP.REQUEST);
exports.render = redux_actions_1.createAction(LOOKUP.SUCCESS);
exports.error = redux_actions_1.createAction(LOOKUP.FAILURE);
exports.navSearch = redux_actions_1.createAction(NAV.SEARCH);
exports.search = function (target) { return function (dispatch) {
    dispatch(exports.navSearch(target));
    dispatch(exports.lookup(target));
    util_1.fetch(target).then(function (res) { return dispatch(exports.render(parser_1.default(res))); }, function (err) { return dispatch(exports.error(err)); });
}; };
//# sourceMappingURL=actions.js.map