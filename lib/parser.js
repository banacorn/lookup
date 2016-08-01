var h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
var h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
var h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
function parseSection(text) {
    var tail = function (list) {
        var result = [];
        for (var i = 1; i < list.length; i++) {
            result.push(list[i]);
        }
        return result;
    };
    function collectSections(text, regexs) {
        if (regexs.length === 0) {
            return {
                paragraph: text,
                sections: {}
            };
        }
        else {
            var obj = {
                paragraph: "",
                sections: {}
            };
            var splitted = text.split(regexs[0]);
            var index = 0;
            for (var _i = 0, splitted_1 = splitted; _i < splitted_1.length; _i++) {
                var value = splitted_1[_i];
                if (index === 0) {
                    obj.paragraph = splitted[0];
                }
                if (index % 2 === 1) {
                    obj.sections[value] = collectSections(splitted[index + 1], tail(regexs));
                }
                index++;
            }
            return obj;
        }
    }
    var h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
    var h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
    var h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
    return collectSections(text, [h2regex, h3regex, h4regex]);
}
function parseEntryLanguage() {
}
function split(text, regex) {
    var splitted = text.split(regex);
    var result = {
        paragraph: "",
        sections: []
    };
    var index = 0;
    for (var _i = 0, splitted_2 = splitted; _i < splitted_2.length; _i++) {
        var header = splitted_2[_i];
        if (index === 0) {
            result.paragraph = splitted[0];
        }
        if (index % 2 === 1) {
            result.sections.push({
                header: header,
                content: splitted[index + 1]
            });
        }
        index++;
    }
    return result;
}
function parseEntry(response) {
    var result = split(response.text, h2regex);
    return {
        word: response.word,
        seeAlso: result.paragraph,
        languages: result.sections
    };
}