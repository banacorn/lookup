"use strict";
var Promise = require('bluebird');
var parser_1 = require('./chrome/parser');
exports.inWebpage = chrome.panels === undefined && chrome.tabs === undefined && chrome.devtools === undefined;
function fetch(word) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        if (exports.inWebpage)
            xhr.open('GET', "http://localhost:4000/search/" + word);
        else
            xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
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
exports.fetch = fetch;
function fetchEntry(word) {
    return fetch(word).then(function (res) { return parser_1.default(res); });
}
exports.fetchEntry = fetchEntry;
//# sourceMappingURL=util.js.map