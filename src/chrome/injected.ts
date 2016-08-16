console.clear();

declare var chrome: any;
console.log(chrome)
var backgroundConn = chrome.runtime.connect({
    name: "woerterbuch-injected"
    // tabId: chrome.devtools.inspectedWindow.tabId
});
backgroundConn.postMessage({
    message: "hey"
});
