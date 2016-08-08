import { printEntry } from "./fmt";
import { parseSection } from "./parser";
declare var chrome: any;

// default state
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
}

// initialize settings
chrome.storage.sync.get(settings, (items) => {
    settings = items;
})

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

    port.onMessage.addListener((response: RawResponse) => {
        // clear old results
        console.clear();
        if (response) {
            console.info("https://en.wiktionary.org/w/index.php?title=" + response.word + "&action=raw");
            console.info("https://en.wiktionary.org/wiki/" + response.word);
            const result = parseSection(response.word, response.text);
            printEntry(result);
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

export {
    settings
}
