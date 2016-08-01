function printLanguageEntry(entry) {
    if (entry.alternativeForms) {
        console.group("Alternative forms");
        console.log(entry.alternativeForms.body);
        console.groupEnd();
    }
    if (entry.etymology) {
        console.group("Etymology");
        console.log(entry.etymology.body);
        console.groupEnd();
    }
    if (entry.pronouciation) {
        console.group("Pronunciation");
        console.log(entry.pronouciation.body);
        console.groupEnd();
    }
    if (entry.derivedTerms) {
        console.group("Derived terms");
        console.log(entry.derivedTerms.body);
        console.groupEnd();
    }
    if (entry.relatedTerms) {
        console.group("Related terms");
        console.log(entry.relatedTerms.body);
        console.groupEnd();
    }
    if (entry.descendants) {
        console.group("Descendants");
        console.log(entry.descendants.body);
        console.groupEnd();
    }
    if (entry.translations) {
        console.group("Translations");
        console.log(entry.translations.body);
        console.groupEnd();
    }
    if (entry.seeAlso) {
        console.group("See Also");
        console.log(entry.seeAlso.body);
        console.groupEnd();
    }
    if (entry.references) {
        console.group("References");
        console.log(entry.references.body);
        console.groupEnd();
    }
    if (entry.externalLinks) {
        console.group("External Links");
        console.log(entry.externalLinks.body);
        console.groupEnd();
    }
}
function printEntry(entry) {
    if (entry) {
        if (settings.displayAllLanguages) {
            console.log(entry.seeAlso);
            for (var _i = 0, _a = entry.languages; _i < _a.length; _i++) {
                var language = _a[_i];
                console.group(language.language);
                printLanguageEntry(language);
                console.groupEnd();
            }
        }
        else {
            var languageEntry = _.find(entry.languages, { language: settings.language });
            if (languageEntry) {
                printLanguageEntry(languageEntry);
            }
            else {
                console.warn("No such entry for " + settings.language);
            }
        }
    }
    else {
        console.warn("Not found");
    }
}
