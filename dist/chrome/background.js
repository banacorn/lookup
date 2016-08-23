"use strict";
var operator_1 = require('./operator');
var operator_2 = require('./operator');
var DEBUG_MODE = true;
if (DEBUG_MODE) {
    operator_1.default.on(operator_2.EVENT.TAB.CLOSED, function (id) {
        console.info("tab[" + id + "] X");
    });
    operator_1.default.on(operator_2.EVENT.PANEL.CONNECTED, function (id) {
        console.info("panel[" + id + "] O");
    });
    operator_1.default.on(operator_2.EVENT.PANEL.DISCONNECTED, function (id) {
        console.info("panel[" + id + "] X");
    });
    operator_1.default.on(operator_2.EVENT.PANEL.MESSAGE, function (id, message) {
        console.info("panel[" + id + "] " + message);
    });
    operator_1.default.on(operator_2.EVENT.CONTENT.CONNECTED, function (id) {
        console.info("content[" + id + "] O");
    });
    operator_1.default.on(operator_2.EVENT.CONTENT.DISCONNECTED, function (id) {
        console.info("content[" + id + "] X");
    });
    operator_1.default.on(operator_2.EVENT.CONTENT.MESSAGE, function (id, message) {
        console.info("content[" + id + "] " + message);
    });
}
//# sourceMappingURL=background.js.map