import * as _ from 'lodash'
// import { lookup } from '../actions';
// import { fetch } from '../util';
// import parse from './parser';
import operator from './operator';
import { EVENT } from './operator';

const DEBUG_MODE = true;
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


// operator.setListener((sendMessage: (msg: any) => void, word: string) => {
//     sendMessage(lookup(word));
// });
