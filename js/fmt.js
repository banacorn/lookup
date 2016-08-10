System.register(["lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _;
    function extractText(fmt) {
        return fmt.map(function (x) { return x.text; }).join("");
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
    function italic(fmt) {
        return fmt.map(function (seg) {
            seg.style.i = true;
            return seg;
        });
    }
    function bold(fmt) {
        return fmt.map(function (seg) {
            seg.style.b = true;
            return seg;
        });
    }
    function link(fmt) {
        return fmt.map(function (seg) {
            seg.style.a = true;
            return seg;
        });
    }
    function add(fmt, text, i, b, a) {
        if (i === void 0) { i = false; }
        if (b === void 0) { b = false; }
        if (a === void 0) { a = false; }
        if (fmt.length === 0) {
            return [{
                    text: text,
                    style: { i: i, b: b, a: a }
                }];
        }
        else {
            var lastIndex = fmt.length - 1;
            var style = { i: i, b: b, a: a };
            if (_.isEqual(fmt[lastIndex].style, style)) {
                fmt[lastIndex].text += text;
                return fmt;
            }
            else {
                return fmt.concat([{
                        text: text,
                        style: style
                    }]);
            }
        }
    }
    function concat(a, b) {
        if (a.length === 0) {
            return b;
        }
        else if (b.length === 0) {
            return a;
        }
        else {
            if (_.isEqual(a[a.length - 1].style, b[0].style)) {
                return a.slice(0, a.length - 1).concat([{
                        text: a[a.length - 1].text + b[0].text,
                        style: b[0].style
                    }]).concat(b.slice(1));
            }
            else {
                return a.concat(b);
            }
        }
    }
    function fold(fmt, elements, f) {
        if (f) {
            elements.forEach(function (e) {
                fmt = concat(fmt, f(formatElement(e)));
            });
        }
        else {
            elements.forEach(function (e) {
                fmt = concat(fmt, formatElement(e));
            });
        }
        return fmt;
    }
    function formatElement(element) {
        switch (element.kind) {
            case "plain":
                var fmt_1 = [];
                return add([], element.text);
            case "italic":
                return fold([], element.subs, italic);
            case "bold":
                return fold([], element.subs, bold);
            case "link":
                return fold([], element.subs, link);
            case "template":
                fmt_1 = add([], "{{" + element.name);
                element.params.forEach(function (param) {
                    if (param.name) {
                        fmt_1 = add(fmt_1, "|" + param.name + "=");
                        fmt_1 = fold(fmt_1, param.value);
                    }
                    else {
                        fmt_1 = add(fmt_1, "|");
                        fmt_1 = fold(fmt_1, param.value);
                    }
                });
                fmt_1 = add(fmt_1, "}}");
                return fmt_1;
        }
    }
    function formatLine(line, order) {
        var numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
        var bullet = line.uli > 0 && line.indent === 0;
        var indentLevel = line.oli + line.uli + line.indent;
        var indentation = _.repeat("  ", indentLevel);
        var formattedElements = fold([], line.line);
        if (numbered) {
            return concat([{
                    text: "" + indentation + order + ". ",
                    style: { i: false, b: false, a: false }
                }], formattedElements);
        }
        else if (bullet) {
            return concat([{
                    text: indentation + "* ",
                    style: { i: false, b: false, a: false }
                }], formattedElements);
        }
        else {
            return concat([{
                    text: "" + indentation,
                    style: { i: false, b: false, a: false }
                }], formattedElements);
        }
    }
    function formatParagraph(paragraph) {
        var fmt = [];
        var order = [1];
        paragraph.forEach(function (line) {
            fmt = concat(fmt, formatLine(line, _.last(order)));
            fmt = add(fmt, "\n");
            var numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
            var level = line.oli;
            if (level > order.length)
                order.push(1);
            else if (level < order.length) {
                order.pop();
            }
        });
        return fmt;
    }
    function formatSection(section) {
        var fmt = [];
        section.body.forEach(function (result) {
            if (result.kind === "ok") {
                fmt = concat(fmt, formatParagraph(result.value));
                fmt = add(fmt, "\n");
            }
            else {
                fmt = add(fmt, "Paragraph parse error\n");
            }
        });
        return fmt;
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
        var formatted = formatSection(section);
        if (formatted.length)
            printFmt(formatted);
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
    return {
        setters:[
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            exports_1("extractText", extractText);
            exports_1("formatElement", formatElement);
            exports_1("formatLine", formatLine);
            exports_1("formatParagraph", formatParagraph);
            exports_1("printEntry", printEntry);
        }
    }
});
