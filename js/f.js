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
    printParagraph(section.body);
    for (var _i = 0, _a = section.subs; _i < _a.length; _i++) {
        var sub = _a[_i];
        printHeader(sub.header);
        printSection(sub);
        console.groupEnd();
    }
}
function printParagraph(paragraph) {
    paragraph.forEach(printLine);
}
function printLine(line) {
    switch (line.kind) {
        case "p":
            console.log(line.text);
            break;
        case "li":
            console.log("•", line.text);
            break;
        case "dd":
            console.log("#", line.text);
            break;
        case "eg":
            console.log("    ", line.text);
            break;
        case "egt":
            console.log("        ", line.text);
            break;
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
