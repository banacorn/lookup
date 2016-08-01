function detectGerman(tabId, changeInfo, callback) {
    if (changeInfo && changeInfo.status === "complete") {
        chrome.tabs.detectLanguage(tabId, function (language) {
            if (language === "de") {
                chrome.pageAction.show(tabId);
                callback();
            }
        });
    }
}
function get(word, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://en.wiktionary.org/w/index.php?title=" + word + "&action=raw", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    detectGerman(tabId, changeInfo, function () {
        var port = chrome.tabs.connect(tabId, { name: "woerterbuch" });
        port.onMessage.addListener(function (word) {
            get(word, function (response) {
                port.postMessage({
                    word: word,
                    text: response
                });
            });
        });
    });
});
