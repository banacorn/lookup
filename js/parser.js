System.register(["lodash", "parsimmon"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, P;
    var h2regex, h3regex, h4regex, h5regex, linkRegex, italicRegex, boldRegex, templateShellRegex, inlineRegex;
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
    function parseInline(text) {
        var inlines = [];
        var remaining = text;
        console.log(text);
        while (remaining.length > 0) {
            var result = remaining.match(inlineRegex);
            if (result) {
                var spaces = result[1];
                var cut = spaces + result[0];
                if (result[2]) {
                    inlines.push({
                        kind: "t",
                        name: cut
                    });
                }
                else if (result[3]) {
                    inlines.push({
                        kind: "a",
                        text: cut
                    });
                }
                else if (result[4]) {
                    inlines.push({
                        kind: "i",
                        text: cut
                    });
                }
                else if (result[5]) {
                    inlines.push({
                        kind: "b",
                        text: cut
                    });
                }
                remaining = remaining.substr(cut.length);
            }
            else {
                var indexLink = remaining.indexOf("[[");
                var indexTemplate = remaining.indexOf("{{");
                var indexItalic = remaining.indexOf("''");
                var indices = [indexLink, indexTemplate, indexItalic];
                if (_.every(indices, function (x) { return x === -1; })) {
                    console.log("indices: " + indices);
                    inlines.push({
                        kind: "span",
                        text: remaining
                    });
                    remaining = "";
                }
                else {
                    var min = _.min(indices.filter(function (x) { return x >= 0; }));
                    if (min === 0) {
                        console.log("min " + min + ", indices: " + indices);
                        console.log("text: [" + remaining + "]");
                        min = 1;
                    }
                    inlines.push({
                        kind: "span",
                        text: remaining.substr(0, min)
                    });
                    remaining = remaining.substr(min);
                }
            }
        }
        return inlines;
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
            }],
        execute: function() {
            console.log(P.all);
            h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
            h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
            h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
            h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
            linkRegex = /\[\[([^\]\|]+)|(?:\|([^\]]+))?\]\]/;
            italicRegex = /''([^.]+)''/;
            boldRegex = /'''([^.]+)'''/;
            templateShellRegex = /\{\{([^\}]+)\}\}/;
            inlineRegex = /^(\s*)(?:\{\{([^\}]+)\}\}|\[\[([^\]]+)\]\]|'''(.+)'''|''([^'].+[^'])''[^']?)/;
            exports_1("parseSection", parseSection);
        }
    }
});
