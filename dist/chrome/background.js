"use strict";
var Promise = require('bluebird');
var operator_1 = require('./operator');
var operator_2 = require('./operator');
var DEBUG_MODE = false;
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
operator_1.default.on(operator_2.EVENT.CONTENT.MESSAGE, function (id, word) {
    console.info("lookup request from content page[" + id + "] " + word);
    operator_1.default.messageUpstream(id, {
        type: 'relay',
        result: word
    });
});
operator_1.default.on(operator_2.EVENT.PANEL.MESSAGE, function (id, word) {
    console.info("lookup request from panel[" + id + "] " + word);
    fetch(word).then(function (res) { return operator_1.default.messageUpstream(id, {
        type: 'success',
        result: res
    }); }, function (err) {
        console.info(err);
        console.info("name", err.name);
        console.info("message", err.message);
        console.info(err.stack);
        operator_1.default.messageUpstream(id, {
            type: 'failure',
            error: {
                name: err.name,
                message: err.massage,
                stack: err.stack
            }
        });
    });
});
function fetch(word) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
        xhr.addEventListener('load', function (e) {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            }
            else {
                reject(new Error("Returned with status code " + xhr.status + ": " + xhr.statusText));
            }
        });
        xhr.addEventListener('error', function (e) {
            reject(new Error("Network Error"));
        });
        xhr.send();
    });
}
exports.fetch = fetch;
//# sourceMappingURL=background.js.map