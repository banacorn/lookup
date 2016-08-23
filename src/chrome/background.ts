import * as Promise from 'bluebird'
import * as _ from 'lodash'
import operator from './operator';
import { EVENT } from './operator';

const DEBUG_MODE = false;
if (DEBUG_MODE) {
    // tab
    operator.on(EVENT.TAB.CLOSED, (id: number) => {
        console.info(`tab[${id}] X`);
    });

    // panel
    operator.on(EVENT.PANEL.CONNECTED, (id: number) => {
        console.info(`panel[${id}] O`);
    });

    operator.on(EVENT.PANEL.DISCONNECTED, (id: number) => {
        console.info(`panel[${id}] X`);
    });

    operator.on(EVENT.PANEL.MESSAGE, (id: number, message: any) => {
        console.info(`panel[${id}] ${message}`);
    });

    // content page
    operator.on(EVENT.CONTENT.CONNECTED, (id: number) => {
        console.info(`content[${id}] O`);
    });

    operator.on(EVENT.CONTENT.DISCONNECTED, (id: number) => {
        console.info(`content[${id}] X`);
    });

    operator.on(EVENT.CONTENT.MESSAGE, (id: number, message: any) => {
        console.info(`content[${id}] ${message}`);
    });

}

operator.on(EVENT.CONTENT.MESSAGE, (id: number, word: string) => {
    console.info(`lookup request from content page[${id}] ${word}`);
    operator.messageUpstream(id, {
        type: 'relay',
        result: word
    });
});

operator.on(EVENT.PANEL.MESSAGE, (id: number, word: string) => {
    console.info(`lookup request from panel[${id}] ${word}`);
    fetch(word).then(
        res => operator.messageUpstream(id, {
            type: 'success',
            result: res
        }),
        err => {
            console.info(err)
            console.info("name", err.name)
            console.info("message", err.message)
            console.info(err.stack)
            operator.messageUpstream(id, {
                type: 'failure',
                // Error cannot be passed
                error: {
                    name: err.name,
                    message: err.massage,
                    stack: err.stack
                }
            })
        }
    )

});

export function fetch(word: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
        xhr.addEventListener('load', (e) => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(`Returned with status code ${xhr.status}: ${xhr.statusText}`));
            }
        });
        xhr.addEventListener('error', (e) => {
            reject(new Error(`Network Error`));
        });
        xhr.send();
    });
}
