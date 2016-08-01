function isPartOfSpeech(name: string): boolean {
    return _.includes([
            // Parts of speech:
            "Adjective", "Adverb", "Ambiposition", "Article", "Circumposition",
            "Classifier", "Conjunction", "Contraction", "Counter", "Determiner",
            "Interjection", "Noun", "Numeral", "Participle", "Particle",
            "Postposition", "Preposition", "Pronoun", "Proper noun", "Verb",
            // Morphemes:
            "Circumfix", "Combining form", "Infix", "Interfix", "Prefix",
            "Root", "Suffix",
            // Symbols and characters:
            "Diacritical mark", "Letter", "Ligature", "Number",
            "Punctuation mark", "Syllable", "Symbol",
            // Phrases
            "Phrase", "Proverb", "Prepositional phrase",
            // Han characters and language-specific varieties:
            "Han character", "Hanzi", "Kanji", "Hanja",
            // Lojban-specific parts of speech
            "Brivla", "Cmavo", "Gismu", "Lujvo", "Rafsi",
            // Romanization
            "Romanization"
        ], name);
}

// a predicate that decides if a section should be collapsed
function shouldCollapse(name: string): boolean {
    return settings.collapse[_.camelCase(name)]
        || (settings.collapse.partOfSpeech && isPartOfSpeech(name));
}

function printHeader(name: string) {
    if (shouldCollapse(name))
        console.groupCollapsed(name);
    else
        console.group(name);
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
