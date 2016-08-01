// default state
var settings = {
    language: "German",
    displayAllLanguages: false,
    collapse: {
        alternativeForms: false,
        etymology: false,
        pronunciation: false,
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
    chrome.storage.sync.set({
        language: languageInput.value,
        displayAllLanguages: displayAllLanguagesInput.checked,
        collapse: {
            alternativeForms: collapseInput.alternativeForms.checked,
            etymology: collapseInput.etymology.checked,
            pronunciation: collapseInput.pronunciation.checked,
            partOfSpeech: collapseInput.partOfSpeech.checked,
            derivedTerms: collapseInput.derivedTerms.checked,
            relatedTerms: collapseInput.relatedTerms.checked,
            descendants: collapseInput.descendants.checked,
            translations: collapseInput.translations.checked,
            seeAlso: collapseInput.seeAlso.checked,
            references: collapseInput.references.checked,
            externalLinks: collapseInput.externalLinks.checked

        }
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
