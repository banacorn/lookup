function printLanguageEntry(entry: LanguageEntry) {

    if (entry.alternativeForms) {
        console.group("Alternative forms");
        console.log(entry.alternativeForms.body);
        console.groupEnd();
    }

    if (entry.etymology.length === 1) {
        console.group("Etymology");
        console.log(entry.etymology[0].body);
        console.groupEnd();
    } else {
        let index = 0;
        for (let etymology in entry.etymology) {
            console.group("Etymology " + (index + 1).toString());
            console.log(entry.etymology[index].body);
            console.groupEnd();
            index += 1;
        }
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
    // console.log(entry)

}
function printEntry(entry: Entry) {
    // if there's such entry
    if (entry) {
        // display all languages
        if (settings.displayAllLanguages) {
            console.log(entry.seeAlso);
            for (let language of entry.languages) {
                console.group(language.language);
                printLanguageEntry(language);
                console.groupEnd();
            }
        } else {
            const languageEntry = _.find(entry.languages, { language: settings.language });
            if (languageEntry) {
                printLanguageEntry(languageEntry);
            } else {
                console.warn("No such entry for " + settings.language);
            }
        }
    } else {
        console.warn("Not found");
    }
}
