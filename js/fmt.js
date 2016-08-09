System.register(["./content", "lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var content_1, _;
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
        return content_1.settings.collapse[_.camelCase(name)]
            || (content_1.settings.collapse.partOfSpeech && isPartOfSpeech(name));
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
        section.body.forEach(function (result) {
            if (result.kind === "ok") {
                fmt = appendFmt(fmt, fmtParagraph(result.value));
                fmt.text += "\n";
            }
            else {
                fmt.text = "Paragraph parse error";
            }
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
        var fmt = {
            text: "",
            style: []
        };
        fmt.text += _.repeat("#", line.oli)
            + _.repeat("*", line.uli)
            + _.repeat(":", line.indent)
            + " ";
        var elements = line.line;
        elements.forEach(function (element) {
            fmt = appendFmt(fmt, fmtElement(element));
        });
        return fmt;
    }
    function fmtElement(element) {
        var fmt = {
            text: "",
            style: []
        };
        if (element.kind === "plain") {
            fmt.text += element.text;
        }
        else if (element.kind === "template") {
            fmt.text += "{{" + element.name;
            element.params.forEach(function (param) {
                if (param.name) {
                    fmt.text += "|" + param.name + "=";
                    param.value.forEach(function (v) {
                        fmt = appendFmt(fmt, fmtElement(v));
                    });
                }
                else {
                    fmt.text += "|";
                    param.value.forEach(function (v) {
                        fmt = appendFmt(fmt, fmtElement(v));
                    });
                }
            });
            fmt.text += "}}";
        }
        else {
            element.subs.forEach(function (e) {
                fmt = appendFmt(fmt, fmtElement(e));
            });
        }
        return fmt;
    }
    function printEntry(settings, entry) {
        if (entry) {
            console.log(settings.displayAllLanguages);
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
    return {
        setters:[
            function (content_1_1) {
                content_1 = content_1_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            exports_1("printEntry", printEntry);
        }
    }
});
