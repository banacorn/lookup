var parseWiktionary = function(reply) {
    var word = reply.word;
    var rawText = reply.rawText;

    var langDelimeterRegex =  /\s\s----\s\s/;
    var germanSectionRegex = /\=\=German\=\=\n\n/;

    // get the german part
    var germanSection = rawText
        .split(langDelimeterRegex)
        .filter((text) => text.match(germanSectionRegex))[0];

    // return early if not found
    if (germanSection === undefined) {
        return undefined;
    }

    //
    var subsectionRegex = /\s\s\=\=\=([^\=]+)\=\=\=\s/g;
    var subsectionsRaw = germanSection.split(subsectionRegex);
    var subsections = {}

    for (var [index, value] of subsectionsRaw.entries()) {
        if (index % 2 === 1) {
            subsections[value] = subsectionsRaw[index + 1];
        }
    }
    return {
        word: word,
        subsections: subsections
    };

}

// detect text selections
document.addEventListener("mouseup", () => {
    var word = window.getSelection().toString().trim();
    if (word) {
        chrome.runtime.sendMessage({word: word});
    }
}, false);

//
chrome.runtime.onMessage.addListener((reply) => {
    // clear the old reply
    console.clear();

    var result = parseWiktionary(reply);
    if (result) {
        console.log("https://en.wiktionary.org/w/index.php?title=" + result.word);
        for (header in result.subsections) {
            console.group(header)
            console.log(result.subsections[header])
            console.groupEnd()
        }
    } else {
        console.warn("Not found");
    }
})
