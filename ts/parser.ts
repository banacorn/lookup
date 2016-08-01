const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;

function parseSection(header: string, text: RawText): Section {
    function collectSections(header: string, text: RawText, regexs: RegExp[]): Section {
        if (regexs.length === 0) {
            return {
                header: header,
                body: parseParagraph(text),
                subs: []
            };
        } else {
            let result = {
                header: header,
                body: parseParagraph(text),
                subs: []
            };
            let splittedChunks = text.split(regexs[0]);
            let index = 0;
            for (let chunk of splittedChunks) {
                if (index === 0) {
                    result.body = parseParagraph(chunk);
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

function parseParagraph(text: RawText): Paragraph {
    return text.split("\n").map((line) => {
        if (_.startsWith(line, "*"))
            return <Line>{
                kind: "li",
                text: line.substring(2)
            };
        if (_.startsWith(line, "#::"))
            return <Line>{
                kind: "egt",
                text: line.substring(4)
            };
        if (_.startsWith(line, "#:"))
            return <Line>{
                kind: "eg",
                text: line.substring(3)
            };
        if (_.startsWith(line, "#"))
            return <Line>{
                kind: "dd",
                text: line.substring(2)
            };

        return <Line>{
            kind: "p",
            text: line
        };
    });
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
                body: splitted[index + 1]
            });
        }
        index++;
    }
    return result;
}
