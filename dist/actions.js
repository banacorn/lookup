"use strict";
var redux_actions_1 = require('redux-actions');
var parser_1 = require('./chrome/parser');
var util_1 = require('./util');
exports.JUMP = 'JUMP';
exports.PARSE_ERROR = 'PARSE_ERROR';
exports.RENDER = 'RENDER';
exports.SEARCH_ERROR = 'SEARCH_ERROR';
exports.jump = redux_actions_1.createAction(exports.JUMP, function (word) { return ({ word: word }); });
exports.parseError = redux_actions_1.createAction(exports.PARSE_ERROR, function (error) { return ({ error: error }); });
exports.render = redux_actions_1.createAction(exports.RENDER, function (body) { return ({ body: body }); });
exports.searchError = redux_actions_1.createAction(exports.SEARCH_ERROR, function (err) { return ({ err: err }); });
exports.search = function (word) { return function (dispatch) { return util_1.fetch(word)
    .then(function (res) {
    dispatch(exports.jump(word));
    dispatch(exports.render(parser_1.default(res)));
}, function (err) { return dispatch(exports.searchError(err)); }); }; };
//# sourceMappingURL=actions.js.map