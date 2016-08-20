import * as Promise from 'bluebird'

export function fetch(word: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', `http://localhost:4000/search/${word}`);
        req.onload = function() {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(new Error("Network error"));
        };
        req.send();
    });
}
