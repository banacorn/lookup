import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';


import Entry from './components/Entry';
import reducer from './reducers/index';
// import { A } from './types'
import { jump, render } from './actions'

declare var chrome: any;

const store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}>
        <Entry />
    </Provider>,
    document.getElementById('entry')
)


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
