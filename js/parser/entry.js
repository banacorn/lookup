System.register(["lodash", "./element"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, element_1;
    var h2regex, h3regex, h4regex, h5regex, interlangRegex;
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
    function parseEntry(header, text) {
        var result = text.match(interlangRegex);
        var trimmedText = text.substring(0, text.length - result[1].length);
        return collectSections(header, text, [h2regex, h3regex, h4regex, h5regex]);
    }
    function parseParagraph(text) {
        var prefixRegex = /(.*)\n(#*)(\**)(\:*) ?(.*)/;
        var result = element_1.parseElements.parse(text);
        if (result.status) {
            var prefixes_1 = result.value.map(function (element, i) {
                if (element.kind === "plain") {
                    var match = element.text.match(prefixRegex);
                    if (match) {
                        return {
                            oli: match[2].length,
                            uli: match[3].length,
                            indent: match[4].length,
                            index: i,
                            before: match[1],
                            after: match[5]
                        };
                    }
                }
            }).filter(function (x) { return x; });
            var lines_1 = [];
            prefixes_1.forEach(function (prefix, i) {
                if (i < prefixes_1.length - 1) {
                    var next = prefixes_1[i + 1];
                    var segment = result.value.slice(prefix.index + 1, next.index);
                    var mergedLine = segment;
                    if (prefix.after)
                        mergedLine = _.concat([element_1.plain(prefix.after)], mergedLine);
                    if (next.before)
                        mergedLine = _.concat(mergedLine, [element_1.plain(next.before)]);
                    lines_1.push({
                        oli: prefix.oli,
                        uli: prefix.uli,
                        indent: prefix.indent,
                        line: mergedLine
                    });
                }
                else {
                    var segment = result.value.slice(prefix.index + 1);
                    var mergedLine = segment;
                    if (prefix.after)
                        mergedLine = _.concat([element_1.plain(prefix.after)], mergedLine);
                    lines_1.push({
                        oli: prefix.oli,
                        uli: prefix.uli,
                        indent: prefix.indent,
                        line: mergedLine
                    });
                }
            });
            return {
                kind: "ok",
                value: lines_1
            };
        }
        else {
            return {
                kind: "err",
                error: "index: " + result.index.toString()
            };
        }
    }
    function removeComments(text) {
        return text.replace(/<!--[-.\n]*-->/g, "");
    }
    function removeInterLangLink(text) {
        return text.replace(/((?:\[\[\S+\:\S+\]\]\n?)+$)/g, "");
    }
    function parseParagraphs(text) {
        return removeInterLangLink(removeComments(text))
            .split(/\n\n/)
            .filter(function (text) { return text.trim(); })
            .map(function (text) { return parseParagraph("\n" + text); });
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
            function (element_1_1) {
                element_1 = element_1_1;
            }],
        execute: function() {
            h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
            h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
            h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
            h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
            interlangRegex = /((?:\[\[\w+\:[^\]]*\]\]\n)*)$/;
            exports_1("parseEntry", parseEntry);
            exports_1("parseParagraph", parseParagraph);
        }
    }
});
