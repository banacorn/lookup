function printEntry(entry) {
    if (entry) {
        if (settings.displayAllLanguages) {
            console.log(entry.seeAlso);
            for (var _i = 0, _a = entry.languages; _i < _a.length; _i++) {
                var language = _a[_i];
                console.group(language.header);
                console.log(language.content);
                console.groupEnd();
            }
        }
        else {
            var languageEntry = _.find(entry.languages, { header: settings.language });
            if (languageEntry) {
                console.group(languageEntry.header);
                console.log(languageEntry.content);
                console.groupEnd();
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
