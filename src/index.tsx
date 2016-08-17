import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";


import Entry from "./components/Entry";
import { display } from "./reducers/index";
import { Action } from "./types"

declare var chrome: any;

const store = createStore(display)

ReactDOM.render(
    <Provider store={store}>
        <Entry />
    </Provider>,
    document.getElementById('example')
)


// detect whether we are in normal webpage or chrome devtools
// so that we can develop in both environments
const inDevtools = chrome.devtools !== undefined;
if (inDevtools) {
    var backgroundConn = chrome.runtime.connect({
        name: "woerterbuch-panel"
    });
    backgroundConn.postMessage({
        tabId: chrome.devtools.inspectedWindow.tabId
    });
    backgroundConn.onMessage.addListener((message: any) => {
        console.log(message);
        store.dispatch({
            type: Action.DISPLAY,
            word: message
        });
    })
}
