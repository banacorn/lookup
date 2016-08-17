declare var chrome: any;

// establish connection with the background page
var backgroundConn = chrome.runtime.connect({
    name: 'woerterbuch-injected'
});


let lastWord: string = undefined;
const onMouseup = () => {
    const word = window.getSelection().toString().trim();
    const repeated = word === lastWord;
    lastWord = word;
    if (word && !repeated) {
        // sends request to the background when there's a non-trivial selection
        backgroundConn.postMessage(word);
    }
};


backgroundConn.onMessage.addListener((message: any) => {
    // asked by the background page to disconnect with her
    if (message === 'decommission') {
        document.removeEventListener('mouseup', onMouseup);
        backgroundConn.disconnect();
    }
})

// listens to text selection events
document.addEventListener('mouseup', onMouseup, false);
