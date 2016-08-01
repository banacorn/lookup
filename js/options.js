// default state
var settings = {
    language: "German",
    displayAllLanguages: false,
}

// DOM elements
var languageInput = document.querySelector("#language");
var displayAllLanguagesInput = document.querySelector("#display-all-languages");

// listeners
languageInput.addEventListener("change", function (event) {
    saveSettings();
});
displayAllLanguagesInput.addEventListener("change", function (event) {
    if (displayAllLanguagesInput.checked) {
        languageInput.setAttribute("disabled", "disabled");
    } else {
        languageInput.removeAttribute("disabled");
    }
    saveSettings();
});
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
    })
}
