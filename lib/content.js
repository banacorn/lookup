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
