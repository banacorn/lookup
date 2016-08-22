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
exports.lookup = redux_actions_1.createAction(LOOKUP.REQUEST, function (word) { return ({ word: word }); });
exports.render = redux_actions_1.createAction(LOOKUP.SUCCESS, function (body) { return ({ body: body }); });
exports.error = redux_actions_1.createAction(LOOKUP.FAILURE, function (err) { return ({ err: err }); });
exports.search = function (word) { return function (dispatch) {
    dispatch(exports.lookup(word));
    util_1.fetch(word).then(function (res) {
        dispatch(exports.render(parser_1.default(res)));
    }, function (err) { return dispatch(exports.lookup(word)); });
}; };
//# sourceMappingURL=actions.js.map