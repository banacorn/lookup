System.register(["lodash", "./parser/inline"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, inline_1;
    var h2regex, h3regex, h4regex, h5regex, linkRegex, italicRegex, boldRegex, templateShellRegex, inlineRegex, testCases;
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
    function removeComments(text) {
        return text.replace(/<!--[-.\n]*-->/g, "");
    }
    function parseParagraphs(text) {
        console.log(text);
        var paragraphs = [];
        var processed = removeComments(text)
            .split(/\n\n/)
            .filter(function (text) { return text.trim(); })
            .map(function (text) { return ("\n" + text); });
        processed.forEach(function (line) {
            console.log("[%c" + line + "%c]", "color: orange", "color: black");
        });
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
            testCases = [];
            testCases.forEach(function (s) {
                console.log(s);
                console.log(inline_1.parseLine.parse(s));
            });
            exports_1("parseSection", parseSection);
        }
    }
});
