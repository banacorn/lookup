import * as fs from 'fs';
import { inspect } from 'util';
import * as http from 'http';
import * as _ from 'lodash';
import 'colors';
var request = require('request');
import { parser, parseXML, groupByHeader, truncate } from '../chrome/parser';
import { Section } from '../types';

function debug(s: any) {
    const t: string = inspect(s, false, null);
    console.log(t.cyan)
}

function debugGreen(s: any) {
    const t: string = inspect(s, false, null);
    console.log(t.green)
}

const word = process.argv[2] || 'Legierung';



read(word, (body) => {
    console.log('=================================================='.magenta)
    console.time('parse')
    parseXML(body).then((result) => {
        // debugGreen(result)
        // debug('done');
        result = truncate(result);
        console.timeEnd('parse')
        console.time('group')
        groupByHeader(result, 'languages', 2);
        console.timeEnd('group')
        // debug(groupByHeader(result, 'languages', 2));
    })
})


function get(word: string, callback: (s: string) => void) {
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

function read(word: string, callback: (s: string) => void) {
    fs.readFile(`corpse/${word}`, (err, data) => {
        if (err && err.errno === -2) {
            console.log(`${word} not found`.gray)
            get(word, callback);
        } else {
            callback(data.toString());
        }
    })
}
