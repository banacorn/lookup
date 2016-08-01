function printEntry(entry: Entry) {
    // if there's such entry
    if (entry) {
        // display all languages
        if (settings.displayAllLanguages) {
            console.log(entry.seeAlso);
            for (var language of entry.languages) {
                console.group(language.header);
                console.log(language.content);
                console.groupEnd();
            }
        } else {
            const languageEntry = _.find(entry.languages, { header: settings.language });
            if (languageEntry) {
                console.group(languageEntry.header);
                console.log(languageEntry.content);
                console.groupEnd();
            } else {
                console.warn("No such entry for " + settings.language);
            }
        }


    } else {
        console.warn("Not found");
    }
}
