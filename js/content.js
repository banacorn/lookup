var settings = {
    language: "German",
    displayAllLanguages: false,
};
chrome.storage.sync.get(settings, function (items) {
    settings = items;
});
chrome.runtime.onConnect.addListener(function (port) {
    document.addEventListener("mouseup", function () {
        var word = window.getSelection().toString().trim();
        if (word) {
            port.postMessage(word);
        }
    }, false);
    port.onMessage.addListener(function (response) {
        console.clear();
        if (response) {
            var result = parseEntry(response);
            printEntry(result);
        }
        else {
            console.warn("Not found");
        }
    });
});
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync") {
        for (var key in changes) {
            settings[key] = changes[key].newValue;
        }
    }
});
