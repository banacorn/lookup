// given a tab, determine if it's in German
var detectGerman = function(tabId, changeInfo, callback) {
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
var get = (word, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://en.wiktionary.org/w/index.php?title=" + word + "&action=raw", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

// waits for messages coming from the tab
var clientMessageListener = (tabId) => (request, sender, sendResponse) => {
    get(request.word, (response) => {
        chrome.tabs.sendMessage(tabId, {
            word: request.word,
            rawText: response
        });
    });
};

var tabStateListener = (tabId, changeInfo, tab) => {
    // remove old clientMessageListener
    chrome.runtime.onMessage.removeListener(clientMessageListener);

    detectGerman(tabId, changeInfo, () => {
        chrome.runtime.onMessage.addListener(clientMessageListener(tabId));
    });
}

chrome.tabs.onUpdated.addListener(tabStateListener);
