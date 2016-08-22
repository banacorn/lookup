"use strict";
var actions_1 = require('../actions');
var util_1 = require('../util');
var parser_1 = require('./parser');
var operator_1 = require('./operator');
operator_1.default.setListener(function (sendMessage, word) {
    sendMessage(actions_1.jump(word));
    util_1.fetch(word).then(function (result) { return sendMessage(actions_1.render(parser_1.default(result))); });
});
//# sourceMappingURL=background.js.map