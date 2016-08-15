// listeners
chrome.runtime.onConnect.addListener((port) => {
    var lastWord = undefined;
    // listens to text selection events
    document.addEventListener("mouseup", () => {
        const word = window.getSelection().toString().trim();
        const repeated = word === lastWord;
        lastWord = word;
        if (word && !repeated) {
            // sends request to the background when there's a non-trivial selection
            port.postMessage(word);
        }
    }, false);

    port.onMessage.addListener((response) => {
        // clear old results
        console.clear();
        if (response) {
            console.info("https://en.wiktionary.org/w/index.php?title=" + response.word + "&printable=yes");
            console.info("https://en.wiktionary.org/wiki/" + response.word);
            // printEntry(settings, parseAndFormat(response.word, response.text));
        } else {
            console.warn("Not found");
        }
    });
});
