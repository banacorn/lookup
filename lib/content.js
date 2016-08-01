function printSections(result) {
    if (typeof result === "string") {
        console.log(result);
    }
    else {
        if (result.paragraph) {
            console.log(result.paragraph);
        }
        for (var header in result.sections) {
            console.group(header);
            printSections(result.sections[header]);
            console.groupEnd();
        }
    }
}
chrome.runtime.onConnect.addListener(function (port) {
    document.addEventListener("mouseup", function () {
        var word = window.getSelection().toString().trim();
        if (word) {
            port.postMessage(word);
        }
    }, false);
    port.onMessage.addListener(function (reply) {
        console.clear();
        if (reply) {
            var result = parseWiktionary(reply.text);
            if (result) {
                console.info("https://en.wiktionary.org/wiki/" + reply.word);
                printSections(result);
            }
            else {
                console.warn("Not found");
            }
        }
        else {
            console.warn("Not found");
        }
    });
});
