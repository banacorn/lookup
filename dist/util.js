"use strict";
var Promise = require('bluebird');
exports.inWebpage = chrome.panels === undefined && chrome.tabs === undefined && chrome.devtools === undefined;
function fetch(word) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        if (exports.inWebpage)
            xhr.open('GET', "http://localhost:4000/search/" + word);
        else
            xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            }
            else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(new Error("Network error"));
        };
        xhr.send();
    });
}
exports.fetch = fetch;
//# sourceMappingURL=util.js.map