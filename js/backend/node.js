System.register(["../parser/element", "../parser/section", "../fmt", "../type", "colors"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var element_1, section_1, fmt_1, type_1;
    function printEntry(entry) {
        var sections = type_1.flattenSection(entry);
        sections.forEach(function (section) {
            console.log(("== " + section.header + " ==").yellow);
            section.body.forEach(function (paragraph) {
                printFmt(paragraph);
            });
        });
    }
    function printFmt(fmt) {
        var text = "";
        var texts = fmt.map(function (seg) {
            var result = seg.text || "";
            if (seg.style.i)
                result = result["italic"];
            if (seg.style.b)
                result = result["bold"];
            if (seg.style.a)
                result = result["underline"];
            text += result;
        });
        console.log(text);
    }
    function parseAndFormat(word, body) {
        var rawEntry = section_1.parseEntry(word, body);
        var parsedEntry = type_1.mapSection(element_1.parseParagraph)(rawEntry);
        return type_1.mapSection(fmt_1.formatParagraph(word))(parsedEntry);
    }
    return {
        setters:[
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
            },
            function (_1) {}],
        execute: function() {
            exports_1("printEntry", printEntry);
            exports_1("parseAndFormat", parseAndFormat);
        }
    }
});
