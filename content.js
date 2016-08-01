var printSections = (result) => {
    if (typeof result === "string") {
        console.log(result)
    } else {
        // print paragraph
        if (result.paragraph) {
            console.log(result.paragraph)
        }

        // print sub-sections
        for (header in result.sections) {
            console.group(header)
            printSections(result.sections[header]);
            console.groupEnd()
        }
    }
}


chrome.runtime.onConnect.addListener((port) => {

    // listens to text selection events
    document.addEventListener("mouseup", () => {
        var word = window.getSelection().toString().trim();
        if (word) {
            // sends request to the background when there's a non-trivial selection
            port.postMessage(word);
        }
    }, false);

    port.onMessage.addListener((reply) => {
        // clear old results
        console.clear();
        if (reply) {
            var result = parseWiktionary(reply.text);
            if (result) {
                console.info("https://en.wiktionary.org/wiki/" + reply.word);
                printSections(result)
            } else {
                console.warn("Not found");
            }
        } else {
            console.warn("Not found");
        }
    });
});
