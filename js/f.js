function appendFmt(a, b) {
    return {
        text: a.text + b.text,
        style: a.style.concat(b.style)
    };
}
function printFmt(fmt) {
    if (fmt.text.trim()) {
        console.log.apply(console, [fmt.text].concat(fmt.style));
    }
}
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
    printFmt(fmtSection(section));
    for (var _i = 0, _a = section.subs; _i < _a.length; _i++) {
        var sub = _a[_i];
        printHeader(sub.header);
        printSection(sub);
        console.groupEnd();
    }
}
function fmtSection(section) {
    var fmt = {
        text: "",
        style: []
    };
    section.body.forEach(function (paragraph) {
        fmt = appendFmt(fmt, fmtParagraph(paragraph));
        fmt.text += "\n";
    });
    return fmt;
}
function fmtParagraph(paragraph) {
    var fmt = {
        text: "",
        style: []
    };
    paragraph.forEach(function (line) {
        fmt = appendFmt(fmt, fmtLine(line));
        fmt.text += "\n";
    });
    return fmt;
}
function fmtLine(line) {
    return {
        text: line,
        style: []
    };
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
