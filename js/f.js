function isPartOfSpeech(name) {
    return _.includes([
        "Adjective", "Adverb", "Ambiposition", "Article", "Circumposition",
        "Classifier", "Conjunction", "Contraction", "Counter", "Determiner",
        "Interjection", "Noun", "Numeral", "Participle", "Particle",
        "Postposition", "Preposition", "Pronoun", "Proper noun", "Verb",
        "Circumfix", "Combining form", "Infix", "Interfix", "Prefix",
        "Root", "Suffix",
        "Diacritical mark", "Letter", "Ligature", "Number",
        "Punctuation mark", "Syllable", "Symbol",
        "Phrase", "Proverb", "Prepositional phrase",
        "Han character", "Hanzi", "Kanji", "Hanja",
        "Brivla", "Cmavo", "Gismu", "Lujvo", "Rafsi",
        "Romanization"
    ], name);
}
function shouldCollapse(name) {
    return settings.collapse[_.camelCase(name)]
        || (settings.collapse.partOfSpeech && isPartOfSpeech(name));
}
function printHeader(name) {
    if (shouldCollapse(name))
        console.groupCollapsed(name);
    else
        console.group(name);
}
function printSection(section) {
    if (section.body.trim())
        console.log(section.body);
    for (var _i = 0, _a = section.subs; _i < _a.length; _i++) {
        var sub = _a[_i];
        printHeader(sub.header);
        printSection(sub);
        console.groupEnd();
    }
}
function printEntry(entry) {
    if (entry) {
        if (settings.displayAllLanguages) {
            printSection(entry);
        }
        else {
            var languageEntry = _.find(entry.subs, { header: settings.language });
            if (languageEntry) {
                printSection(languageEntry);
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
