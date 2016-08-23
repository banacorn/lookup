import { Store } from 'redux';
import * as Promise from 'bluebird'
import parse from './chrome/parser';
import { LanguageSection } from './types';
import { lookup } from './actions';

export const inWebpage = chrome.panels === undefined && chrome.tabs === undefined && chrome.devtools === undefined;

let connection: any = null;

export function connectBackground(store: Store<any>) {
    connection = chrome.runtime.connect({
        name: 'woerterbuch-panel'
    });
    connection.postMessage({
        type: 'initialize',
        id: chrome.devtools.inspectedWindow.tabId
    });
    connection.onMessage.addListener((reply: any) => {
        if (reply.type === 'relay') {
            store.dispatch(lookup(reply.result));
        }
    });
}

export function fetch(word: string): Promise<string> {
    if (inWebpage) {
        return new Promise<string>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:4000/search/${word}`);
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
    } else {
        return new Promise<string>((resolve, reject) => {
            if (connection) {
                const listenOnce = (reply: any) => {
                    switch (reply.type) {
                        case 'success':
                            resolve(reply.result);
                            connection.onMessage.removeListener(listenOnce);
                            break;
                        case 'failure':
                            const error = new Error(reply.error.name);
                            reject(error);
                            connection.onMessage.removeListener(listenOnce);
                            break;
                    }
                };
                connection.onMessage.addListener(listenOnce);
                connection.postMessage({
                    type: 'lookup',
                    payload: word
                });
            } else {
                reject(new Error(`Not connected with the background yet`));
            }
        });
    }
}

export function fetchEntry(word: string): Promise<LanguageSection[]> {
    return fetch(word).then(res => parse(res))
}
