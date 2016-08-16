import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";


import { Hello } from "./components/Hello";
import Counter from "./components/Counter";
import counter from "./reducers/index";

declare var chrome: any;


const mapStateToProps = (state: number) => {
    return {
        value: state
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onIncrement: () => dispatch({ type: 'INCREMENT' }),
        onDecrement: () => dispatch({ type: 'DECREMENT' }),
    }
}

const store = createStore(counter)

const Cntr = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter);


ReactDOM.render(
    <Provider store={store}>
        <Cntr />
    </Provider>,
    document.getElementById('example')
)

setTimeout(() => {
    store.dispatch({ type: "INCREMENT" });
}, 1000)

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
    })
}
