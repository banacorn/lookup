function printSection(entry, name) {
    var fieldName = _.camelCase(name);
    if (entry[fieldName]) {
        console.group(name);
        console.log(entry[fieldName].body);
        console.groupEnd();
    }
}
function printLanguageEntry(entry) {
    printSection(entry, "Alternative forms");
    if (entry.etymology.length === 1) {
        console.group("Etymology");
        console.log(entry.etymology[0].body);
        console.groupEnd();
        printSection(entry, "Pronunciation");
    }
    else {
        printSection(entry, "Pronunciation");
        var index_1 = 0;
        for (var _i = 0, _a = entry.etymology; _i < _a.length; _i++) {
            var etymology = _a[_i];
            console.group("Etymology " + (index_1 + 1).toString());
            console.log(entry.etymology[index_1].body);
            console.groupEnd();
            index_1 += 1;
        }
    }
    var index = 0;
    for (var _b = 0, _c = entry.partOfSpeech; _b < _c.length; _b++) {
        var pos = _c[_b];
        console.group(pos.header);
        console.log(pos.body);
        console.groupEnd();
        index += 1;
    }
    printSection(entry, "Derived terms");
    printSection(entry, "Related terms");
    printSection(entry, "Descendants");
    printSection(entry, "Translations");
    printSection(entry, "See Also");
    printSection(entry, "References");
    printSection(entry, "External Links");
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
