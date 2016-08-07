System.register(["lodash", "parsimmon", "./parser/inline"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, P, inline_1;
    var h2regex, h3regex, h4regex, h5regex, linkRegex, italicRegex, boldRegex, templateShellRegex, inlineRegex, parseLine, testCases;
    function parseSection(header, text) {
        function collectSections(header, text, regexs) {
            if (regexs.length === 0) {
                return {
                    header: header,
                    body: parseParagraphs(text),
                    subs: []
                };
            }
            else {
                var result = {
                    header: header,
                    body: undefined,
                    subs: []
                };
                var splittedChunks = text.split(regexs[0]);
                var index = 0;
                for (var _i = 0, splittedChunks_1 = splittedChunks; _i < splittedChunks_1.length; _i++) {
                    var chunk = splittedChunks_1[_i];
                    if (index === 0) {
                        result.body = parseParagraphs(chunk);
                    }
                    if (index % 2 === 1) {
                        result.subs.push(collectSections(chunk, splittedChunks[index + 1], _.tail(regexs)));
                    }
                    index++;
                }
                return result;
            }
        }
        return collectSections(header, text, [h2regex, h3regex, h4regex]);
    }
    function parseParagraphs(text) {
        var paragraphs = [];
        var paragraph = [];
        text.split("\n").forEach(function (line) {
            if (line.trim() === "") {
                if (paragraph.length > 0) {
                    paragraphs.push(paragraph);
                    paragraph = [];
                }
            }
            else {
                paragraph.push(line);
            }
        });
        if (paragraph.length > 0)
            paragraphs.push(paragraph);
        return paragraphs;
    }
    function split(text, regex) {
        var splitted = text.split(regex);
        var result = {
            paragraph: "",
            sections: []
        };
        var index = 0;
        for (var _i = 0, splitted_1 = splitted; _i < splitted_1.length; _i++) {
            var header = splitted_1[_i];
            if (index === 0) {
                result.paragraph = splitted[0];
            }
            if (index % 2 === 1) {
                result.sections.push({
                    header: header,
                    body: splitted[index + 1]
                });
            }
            index++;
        }
        return result;
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (P_1) {
                P = P_1;
            },
            function (inline_1_1) {
                inline_1 = inline_1_1;
            }],
        execute: function() {
            h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
            h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
            h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
            h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
            linkRegex = /\[\[([^\]\|]+)|(?:\|([^\]]+))?\]\]/;
            italicRegex = /''([^.]+)''/;
            boldRegex = /'''([^.]+)'''/;
            templateShellRegex = /\{\{([^\}]+)\}\}/;
            inlineRegex = /^(\s*)(?:\{\{([^\}]+)\}\}|\[\[([^\]]+)\]\]|'''(.+)'''|''([^'].+[^'])''[^']?)/;
            parseLine = P.seq(P.string("#").many(), P.string("*").many(), P.string(":").many(), P.whitespace, inline_1.parseInlines(P.alt(P.eof, P.regex(/\n/)))).map(function (chunk) {
                return {
                    oli: chunk[0].length,
                    uli: chunk[1].length,
                    indent: chunk[2].length,
                    line: chunk[3]
                };
            });
            testCases = [
                "# {{lb|de|co-ordinating}} [[and]]",
                "#: {{ux|de|Kaffee '''und''' Kuchen|t=coffee '''and''' cake}}",
                "#: {{ux|de|Ich kam, sah '''und''' siegte.|t=I came, saw, '''and''' conquered.}}",
                "#* '''1904''', Rudolf Eisler, ''Wörterbuch der philosophischen Begriffe'', Berlin, volume 1, sub verbo ''Ich'', page 446-457:",
            ];
            testCases.forEach(function (s) {
            });
            exports_1("parseSection", parseSection);
        }
    }
});
