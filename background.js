var detectDeutsch = function(tabId, changeInfo, callback) {
    if (changeInfo && changeInfo.status === "complete") {
        chrome.tabs.detectLanguage(tabId, (language) => {
            if (language === "de") {
                chrome.pageAction.show(tabId);
                callback();
            }
        });
    }
}

var clientMessageListener = function(request, sender, sendResponse) {
    console.log(request);
    sendResponse("roger that");
};

var listener = (tabId, changeInfo, tab) => {

    // remove old clientMessageListener
    chrome.runtime.onMessage.removeListener(clientMessageListener);
    
    detectDeutsch(tabId, changeInfo, () => {
        console.log("====== updated ======")
        chrome.runtime.onMessage.addListener(clientMessageListener);
    });
}

chrome.tabs.onUpdated.addListener(listener);
