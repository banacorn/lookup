const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;

function parseSection(text: RawText) {
    // the tail you've met in Haskell
    var tail = (list) => {
        var result = [];
        for (var i = 1; i < list.length; i++) {
            result.push(list[i]);
        }
        return result;
    }

    function collectSections(text: RawText, regexs: RegExp[]): any {
        if (regexs.length === 0) {
            return {
                paragraph: text,
                sections: {}
            }
        } else {
            var obj = {
                paragraph: "",
                sections: {}
            };
            var splitted = text.split(regexs[0]);

            let index = 0;
            for (var value of splitted) {
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

function split(text: RawText, regex: RegExp): {
    paragraph: string,
    sections: Section[]
} {
    const splitted = text.split(regex);
    let result = {
        paragraph: "",
        sections: []
    }
    let index = 0;  // for enumeration
    for (var header of splitted) {
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

function parseEntry(response: RawResponse): Entry {
    const result = split(response.text, h2regex);

    return {
        word: response.word,
        seeAlso: result.paragraph,
        languages: result.sections
    }
}
