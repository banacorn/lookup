"use strict";
var Promise = require('bluebird');
function fetch(word) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
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
//# sourceMappingURL=util.js.map