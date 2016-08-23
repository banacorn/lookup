import * as Promise from 'bluebird'
import parse from './chrome/parser';
import { LanguageSection } from './types';

export const inWebpage = chrome.panels === undefined && chrome.tabs === undefined && chrome.devtools === undefined;

export function fetch(word: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        if (inWebpage)
            xhr.open('GET', `http://localhost:4000/search/${word}`);
        else
            xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);

        xhr.addEventListener('load', (e) => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        });
        xhr.addEventListener('error', (e) => {
                reject(new Error(`Network Error`));
        });

        xhr.send();
    });
}

export function fetchEntry(word: string): Promise<LanguageSection[]> {
    return fetch(word).then(res => parse(res))
}
