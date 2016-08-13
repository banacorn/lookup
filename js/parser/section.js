System.register(["lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _;
    var h2regex, h3regex, h4regex, h5regex, interlangRegex;
    // helper functions
    function split(text, regex) {
        var splitted = text.split(regex);
        var result = {
            paragraph: "",
            sections: []
        };
        var index = 0; // for enumeration
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
    function removeComments(text) {
        return text.replace(/<!--[-.\n]*-->/g, "");
    }
    function removeInterLangLink(text) {
        return text.replace(/((?:\[\[\S+\:\S+\]\]\n?)+$)/g, "");
    }
    // parses an entry into sections of structured RawText
    function parseEntry(header, text) {
        var processed = removeInterLangLink(removeComments(text));
        return parseSection(header, processed, [h2regex, h3regex, h4regex, h5regex]);
    }
    // parses a piece of RawText into sections of structured RawText
    function parseSection(header, text, regexs) {
        if (regexs.length === 0) {
            return {
                header: header,
                body: text
                    .split(/\n\n/)
                    .filter(function (text) { return text.trim(); })
                    .map(function (text) { return "\n" + text; }),
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
                    result.body = chunk
                        .split(/\n\n/)
                        .filter(function (text) { return text.trim(); })
                        .map(function (text) { return "\n" + text; });
                }
                if (index % 2 === 1) {
                    result.subs.push(parseSection(chunk, splittedChunks[index + 1], _.tail(regexs)));
                }
                index++;
            }
            return result;
        }
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
            h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
            h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
            h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
            interlangRegex = /((?:\[\[\w+\:[^\]]*\]\]\n)*)$/;
            exports_1("parseEntry", parseEntry);
        }
    }
});
