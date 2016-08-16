import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

declare var chrome: any;

ReactDOM.render(
    <Hello compiler="TypeScript" framework="Fuck" />,
    document.getElementById("example")
);

connectBackground();


function connectBackground() {
    var backgroundConn = chrome.runtime.connect({
        name: "woerterbuch-panel"
    });
    backgroundConn.postMessage({
        tabId: chrome.devtools.inspectedWindow.tabId
    });
};
