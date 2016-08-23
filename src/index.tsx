import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from './components/App';
import reducer from './reducer';
import { lookup } from './actions';
import { inWebpage } from './util';

declare var chrome: any;

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)

// detect whether we are in normal webpage or chrome devtools
// so that we can develop in both environments
if (inWebpage) {
    store.dispatch(lookup("Eisen"));
} else {
    var backgroundConn = chrome.runtime.connect({
        name: 'woerterbuch-panel'
    });
    backgroundConn.postMessage({
        type: 'initialize',
        id: chrome.devtools.inspectedWindow.tabId
    });
    backgroundConn.onMessage.addListener(store.dispatch);
}
