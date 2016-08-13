System.register(["lodash", "../parser/element", "../parser/section", "../fmt", "../type"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, element_1, section_1, fmt_1, type_1;
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
    function shouldCollapse(settings, name) {
        return settings.collapse[_.camelCase(name)]
            || (settings.collapse.partOfSpeech && isPartOfSpeech(name));
    }
    function printHeader(settings, name) {
        if (shouldCollapse(settings, name))
            console.groupCollapsed(name);
        else
            console.group(name);
    }
    function printSection(settings, section) {
        if (section.body.length) {
            section.body.forEach(function (paragraph) {
                printFmt(paragraph);
                console.log("\n");
            });
        }
        for (var _i = 0, _a = section.subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            printHeader(settings, sub.header);
            printSection(settings, sub);
            console.groupEnd();
        }
    }
    function printEntry(settings, entry) {
        if (entry) {
            if (settings.displayAllLanguages) {
                printSection(settings, entry);
            }
            else {
                var languageEntry = _.find(entry.subs, { header: settings.language });
                if (languageEntry) {
                    printSection(settings, languageEntry);
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
    function printFmt(fmt) {
        var texts = "%c" + fmt.map(function (x) { return x.text; }).join("%c");
        var styles = fmt.map(function (seg) {
            var css = "";
            if (seg.style.i)
                css += "font-style: italic;";
            if (seg.style.b)
                css += "font-weight: bold;";
            if (seg.style.a)
                css += "text-decoration; underline;";
            return css;
        });
        console.log.apply(console, [texts].concat(styles));
    }
    function parseAndFormat(word, body) {
        var rawEntry = section_1.parseEntry(word, body);
        var parsedEntry = type_1.mapSection(element_1.parseParagraph)(rawEntry);
        return type_1.mapSection(fmt_1.formatParagraph)(parsedEntry);
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (element_1_1) {
                element_1 = element_1_1;
            },
            function (section_1_1) {
                section_1 = section_1_1;
            },
            function (fmt_1_1) {
                fmt_1 = fmt_1_1;
            },
            function (type_1_1) {
                type_1 = type_1_1;
            }],
        execute: function() {
            exports_1("printEntry", printEntry);
            exports_1("parseAndFormat", parseAndFormat);
        }
    }
});
