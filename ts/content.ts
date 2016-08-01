// default state
var settings = {
    language: "German",
    displayAllLanguages: false,
}

// initialize settings
chrome.storage.sync.get(settings, (items) => {
    settings = items;
})

// listeners
chrome.runtime.onConnect.addListener((port) => {

    // listens to text selection events
    document.addEventListener("mouseup", () => {
        var word = window.getSelection().toString().trim();
        if (word) {
            // sends request to the background when there's a non-trivial selection
            port.postMessage(word);
        }
    }, false);

    port.onMessage.addListener((response: RawResponse) => {
        // clear old results
        console.clear();
        if (response) {
            const result = parseEntry(response);
            printEntry(result);
            // if (result) {
            //     console.info("https://en.wiktionary.org/wiki/" + response.word);
            //     printSections(result)
            // } else {
            //     console.warn("Not found");
            // }
        } else {
            console.warn("Not found");
        }
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync") {
        for (var key in changes) {
            settings[key] = changes[key].newValue;
        }
    }
});
