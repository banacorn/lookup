import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import Entry from './components/Entry';
import reducer from './reducer';

declare var chrome: any;

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

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
    backgroundConn.onMessage.addListener(store.dispatch);
}
