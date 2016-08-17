import * as _ from 'lodash';
import * as Promise from "bluebird";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';


import Entry from './components/Entry';
import reducer from './reducers/index';
import { jump, render } from './actions'
import { parseString } from 'xml2js';

declare var chrome: any;

const store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}>
        <Entry />
    </Provider>,
    document.getElementById('entry')
)

var parseStringP = Promise.promisify(parseString);
//
//
// function parseXML({ dispatch }) {
//     return (next: any) => (action: any) => {
//         if (action.type === "RENDER") {
//             // Call the next dispatch method in the middleware chain.
//             // let returnValue = next(action)
//
//             // console.log('state aftesr dispatch', getState())
//
//             // This will likely be the action itself, unless
//             // a middleware further in chain changed it.
//             // return returnValue;
//             return parseStringP(action.payload.body).then(
//                 result => {
//                     dispatch({
//                         type: "RENNDER",
//                         payload: result
//                     });
//                 },
//                 error => {
//                     dispatch({
//                         type: "RENNDER",
//                         payload: error
//                     });
//                 }
//             )
//         } else {
//             return next(action);
//         }
//     }
// }

// detect whether we are in normal webpage or chrome devtools
// so that we can develop in both environments
const inDevtools = chrome.devtools !== undefined;
if (inDevtools) {
    var backgroundConn = chrome.runtime.connect({
        name: 'woerterbuch-panel'
    });
    backgroundConn.postMessage({
        tabId: chrome.devtools.inspectedWindow.tabId
    });
    backgroundConn.onMessage.addListener((message: any) => {
        switch (message.type) {
            case 'jump':
                store.dispatch(jump(message.payload));
                break;
            case 'render':
                store.dispatch(render(message.payload));
                break;
        }
    });
}
