var h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
var h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
var h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
var h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
var linkRegex = /\[\[([^\]\|]+)|(?:\|([^\]]+))?\]\]/;
var italicRegex = /''([^.]+)''/;
var boldRegex = /'''([^.]+)'''/;
var templateShellRegex = /\{\{([^\}]+)\}\}/;
var inlineRegex = /^(\s*)(?:\{\{([^\}]+)\}\}|\[\[([^\]]+)\]\]|'''([^']+)'''|''([^']+)'')/;
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
function parseLink(text) {
    var result = text.match(linkRegex);
    if (result) {
        return {
            kind: "a",
            text: result[1],
            rename: result[2]
        };
    }
}
function parseItalic(text) {
    var result = text.match(italicRegex);
    if (result) {
        return {
            kind: "i",
            text: result[1]
        };
    }
}
function parseBold(text) {
    var result = text.match(boldRegex);
    if (result) {
        return {
            kind: "b",
            text: result[1]
        };
    }
}
function parseTemplate(text) {
    var result = text.match(templateShellRegex);
    if (result) {
        return {
            kind: "t",
            name: "test",
            params: [],
            named: {}
        };
    }
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
