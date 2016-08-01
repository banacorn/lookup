declare var chrome: any;

function detectGerman(tabId, changeInfo, callback) {
    if (changeInfo && changeInfo.status === "complete") {
        chrome.tabs.detectLanguage(tabId, (language) => {
            if (language === "de") {
                // activate the icon
                chrome.pageAction.show(tabId);
                callback();
            }
        });
    }
}

// ajax get
function get(word, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://en.wiktionary.org/w/index.php?title=" + word + "&action=raw", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    detectGerman(tabId, changeInfo, () => {
        var port = chrome.tabs.connect(tabId, {name: "woerterbuch"});

        port.onMessage.addListener((message) => {
            get(message, (response) => {
                port.postMessage({
                    word: message,
                    text: response
                });
            });
        });
    });
});
