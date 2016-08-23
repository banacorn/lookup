"use strict";
var Promise = require('bluebird');
var parser_1 = require('./chrome/parser');
var actions_1 = require('./actions');
exports.inWebpage = chrome.panels === undefined && chrome.tabs === undefined && chrome.devtools === undefined;
var connection = null;
function connectBackground(store) {
    connection = chrome.runtime.connect({
        name: 'woerterbuch-panel'
    });
    connection.postMessage({
        type: 'initialize',
        id: chrome.devtools.inspectedWindow.tabId
    });
    connection.onMessage.addListener(function (reply) {
        if (reply.type === 'relay') {
            store.dispatch(actions_1.lookup(reply.result));
        }
    });
}
exports.connectBackground = connectBackground;
function fetch(word) {
    if (exports.inWebpage) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "http://localhost:4000/search/" + word);
            xhr.addEventListener('load', function (e) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                }
                else {
                    reject(new Error(xhr.statusText));
                }
            });
            xhr.addEventListener('error', function (e) {
                reject(new Error("Network Error"));
            });
            xhr.send();
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            if (connection) {
                var listenOnce_1 = function (reply) {
                    switch (reply.type) {
                        case 'success':
                            resolve(reply.result);
                            connection.onMessage.removeListener(listenOnce_1);
                            break;
                        case 'failure':
                            var error = new Error(reply.error.name);
                            reject(error);
                            connection.onMessage.removeListener(listenOnce_1);
                            break;
                    }
                };
                connection.onMessage.addListener(listenOnce_1);
                connection.postMessage({
                    type: 'lookup',
                    payload: word
                });
            }
            else {
                reject(new Error("Not connected with the background yet"));
            }
        });
    }
}
exports.fetch = fetch;
function fetchEntry(word) {
    return fetch(word).then(function (res) { return parser_1.default(res); });
}
exports.fetchEntry = fetchEntry;
//# sourceMappingURL=util.js.map