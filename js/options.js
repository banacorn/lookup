// default state
var settings = {
    language: "German",
    displayAllLanguages: false,
}

// DOM elements
var languageInput = document.querySelector("#language");
var displayAllLanguagesInput = document.querySelector("#display-all-languages");

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



languageInput.addEventListener("change", languageInputListener);
displayAllLanguagesInput.addEventListener("change", displayAllLanguagesInputListener);
document.addEventListener('DOMContentLoaded', restoreSettings);

// functions
function saveSettings() {
    chrome.storage.sync.set({
        language: languageInput.value,
        displayAllLanguages: displayAllLanguagesInput.checked
    });
}

function restoreSettings() {
    chrome.storage.sync.get(settings, (items) => {
        settings = items;

        languageInput.value = settings.language;
        displayAllLanguagesInput.checked = settings.displayAllLanguages;

        languageInputListener();
        displayAllLanguagesInputListener();
    })
}
