declare var chrome: any;

console.log("injected")


// handles all incoming connections
// chrome.runtime.onConnect.addListener((connection: any) => {
//     console.log(connection)
// });

// establish connection with the background page
var backgroundConn = chrome.runtime.connect({
    name: "woerterbuch-injected"
});

// backgroundConn.onDisconnect.addListener((message: any) => {
//     console.log("disconnected!!!!");
// })
//
// backgroundConn.onMessage.addListener((message: any) => {
//     if (message === "decommission") {
//         document.removeEventListener("mouseup", onMouseup);
//         console.log("decommission!!!!");
//     }
// })

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

// listens to text selection events
document.addEventListener("mouseup", onMouseup, false);
