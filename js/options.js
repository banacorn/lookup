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
        derivedTerms: false,
        relatedTerms: false,
        descendants: false,
        translations: true,
        seeAlso: false,
        references: true,
        externalLinks: true
    }
}

// DOM elements
var languageInput = document.querySelector("#language");
var displayAllLanguagesInput = document.querySelector("#display-all-languages");
var collapseInput = {
    alternativeForms: document.querySelector("#collapse-alternative-forms"),
    etymology: document.querySelector("#collapse-etymology"),
    pronunciation: document.querySelector("#collapse-pronunciation"),
    homophones: document.querySelector("#collapse-homophones"),
    rhymes: document.querySelector("#collapse-rhymes"),
    partOfSpeech: document.querySelector("#collapse-part-of-speech"),
    derivedTerms: document.querySelector("#collapse-derived-terms"),
    relatedTerms: document.querySelector("#collapse-related-terms"),
    descendants: document.querySelector("#collapse-descendants"),
    translations: document.querySelector("#collapse-translations"),
    seeAlso: document.querySelector("#collapse-see-also"),
    references: document.querySelector("#collapse-references"),
    externalLinks: document.querySelector("#collapse-external-links")
}

// listeners
function languageInputListener() {
    saveSettings();
}

function displayAllLanguagesInputListener() {
    if (displayAllLanguagesInput.checked) {
        languageInput.setAttribute("disabled", "disabled");
    } else {
        languageInput.removeAttribute("disabled");
    }
    saveSettings();
}

function languageInputListener() {
    saveSettings();
}

languageInput.addEventListener("change", languageInputListener);
displayAllLanguagesInput.addEventListener("change", displayAllLanguagesInputListener);
// batch event register
for (name in collapseInput) {
    var checkbox = collapseInput[name];
    checkbox.addEventListener("change", () => {
        saveSettings();
    })
}

document.addEventListener('DOMContentLoaded', restoreSettings);

// functions
function saveSettings() {
    var collapseSettings = {};
    for (name in collapseInput) {
        collapseSettings[name] = collapseInput[name].checked;
    }

    chrome.storage.sync.set({
        language: languageInput.value,
        displayAllLanguages: displayAllLanguagesInput.checked,
        collapse: collapseSettings
    });
}

function restoreSettings() {
    chrome.storage.sync.get(settings, (items) => {
        settings = items;

        languageInput.value              = settings.language;
        displayAllLanguagesInput.checked = settings.displayAllLanguages;
        // batch restore
        for (name in collapseInput) {
            var checkbox = collapseInput[name];
            checkbox.checked = settings.collapse[name];
        }

        languageInputListener();
        displayAllLanguagesInputListener();
    })
}
