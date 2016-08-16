declare var chrome: any;

// establish connection with the background page
var backgroundConn = chrome.runtime.connect({
    name: "woerterbuch-injected"
});

let lastWord: string = undefined;
// listens to text selection events
document.addEventListener("mouseup", () => {
    const word = window.getSelection().toString().trim();
    const repeated = word === lastWord;
    lastWord = word;
    if (word && !repeated) {
        // sends request to the background when there's a non-trivial selection
        backgroundConn.postMessage(word);
    }
}, false);
