"use strict";
var actions_1 = require('../actions');
var operator_1 = require('./operator');
operator_1.default.setListener(function (sendMessage, word) {
    sendMessage(actions_1.lookup(word));
});
//# sourceMappingURL=background.js.map