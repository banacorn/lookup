import * as fs from 'fs';
import { inspect } from 'util';
import 'colors';
var request = require('request');

export function debug(s: any) {
    const t: string = inspect(s, false, null);
    console.log(t.cyan)
}

export function debugGreen(s: any) {
    const t: string = inspect(s, false, null);
    console.log(t.green)
}

export function fetch(word: string, callback: (s: string) => void) {
    console.log(`fetching ${word}`.gray)
    request(`http://en.wiktionary.org/w/index.php?title=${word}&printable=true`, (error: Error, response: any, body: any) => {
        if (!error && response.statusCode == 200) {
            console.log(`${word} fetched`.gray)
            callback(body);
            fs.writeFile(`corpse/${word}`, body);
        } else {
            console.log(`fetching ${word} failed`.gray, response.statusCode)
        }
    })
}

export function search(word: string, callback: (s: string) => void) {
    fs.readFile(`corpse/${word}`, (err, data) => {
        if (err && err.errno === -2) {
            console.log(`${word} not found`.gray)
            fetch(word, callback);
        } else {
            callback(data.toString());
        }
    })
}
