function printHeader(name: string) {
    console.group(name);
    // if (settings.collapse[_.camelCase(name)])
    //     console.groupCollapsed(name);
    // else
    //     console.group(name);
}

// function printSection(entry: LanguageSection, name: string) {
//     const fieldName = _.camelCase(name);
//     if (entry[fieldName]) {
//         printHeader(name);
//         console.log(entry[fieldName].body);
//         console.groupEnd();
//     }
// }

function printSection(section: Section) {
    if (section.body.trim())
        console.log(section.body)
    for (let sub of section.subs) {
        printHeader(sub.header);
        printSection(sub);
        console.groupEnd();
    }
}

// function printLanguageEntry(entry: Section) {
//
//     printSection(entry);

    // printSection(entry, "Alternative forms");
    //
    // // if an entry has more than 1 etymology, the pronunciation section will be moved forward
    // if (entry.etymology.length === 1) {
    //     printHeader("Etymology")
    //     console.log(entry.etymology[0].body);
    //     console.groupEnd();
    //
    //     printSection(entry, "Pronunciation");
    //
    // } else {
    //
    //     printSection(entry, "Pronunciation");
    //
    //     let index = 0;
    //     for (let etymology of entry.etymology) {
    //         printHeader("Etymology " + (index + 1).toString());
    //         console.log(entry.etymology[index].body);
    //         console.groupEnd();
    //         index += 1;
    //     }
    // }
    //
    // printSection(entry, "Homophones");
    // printSection(entry, "Rhymes");
    //
    // // Part of speech
    // let index = 0;
    // for (let pos of entry.partOfSpeech) {
    //     if (settings.collapse.partOfSpeech)
    //         console.groupCollapsed(pos.header);
    //     else
    //         console.group(pos.header);
    //     console.log(pos.body);
    //     console.groupEnd();
    //     index += 1;
    // }
    //
    // printSection(entry, "Derived terms");
    // printSection(entry, "Related terms");
    // printSection(entry, "Descendants");
    // printSection(entry, "Translations");
    // printSection(entry, "See Also");
    // printSection(entry, "References");
    // printSection(entry, "External Links");
// }


function printEntry(entry: Entry) {
    // if there's such entry
    if (entry) {

        // display all languages
        if (settings.displayAllLanguages) {
            printSection(entry);
        } else {
            // find the specified language (nullable)
            const languageEntry = _.find(entry.subs, { header: settings.language });
            if (languageEntry) {
                printSection(languageEntry);
            } else {
                console.warn("No such entry for " + settings.language);
            }
        }
    } else {
        console.warn("Not found");
    }
}
