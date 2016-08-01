var settings = {
    language: "German",
    displayAllLanguages: false,
    collapse: {
        alternativeForms: false,
        etymology: false,
        pronunciation: false,
        homophones: true,
        rhymes: true,
        partOfSpeech: false,
        usageNotes: false,
        inflection: false,
        conjugation: false,
        declension: false,
        quotations: false,
        synonyms: false,
        antonyms: false,
        coordinateTerms: false,
        derivedTerms: false,
        relatedTerms: false,
        descendants: false,
        translations: true,
        anagrams: true,
        trivia: true,
        seeAlso: false,
        references: true,
        externalLinks: true
    }
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
            console.info("https://en.wiktionary.org/wiki/" + response.word);
            var result = parseSection(response.word, response.text);
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
