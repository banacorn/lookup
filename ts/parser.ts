const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
const h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
const linkRegex = /\[\[([^\]\|]+)|(?:\|([^\]]+))?\]\]/;
const italicRegex = /''([^.]+)''/;
const boldRegex = /'''([^.]+)'''/;
const templateShellRegex = /\{\{([^\}]+)\}\}/;
const inlineRegex = /^(\s*)(?:\{\{([^\}]+)\}\}|\[\[([^\]]+)\]\]|'''(.+)'''|''([^'].+[^'])''[^']?)/;
function parseSection(header: string, text: RawText): Section {
    function collectSections(header: string, text: RawText, regexs: RegExp[]): Section {
        if (regexs.length === 0) {
            return {
                header: header,
                body: parseParagraphs(text),
                subs: []
            };
        } else {
            let result = {
                header: header,
                body: undefined,
                subs: []
            };
            let splittedChunks = text.split(regexs[0]);
            let index = 0;
            for (let chunk of splittedChunks) {
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

function parseParagraphs(text: RawText): Paragraph[] {
    let paragraphs: Paragraph[] = [];
    let paragraph: Paragraph = [];
    // text.split("\n").forEach((line) => {
    //     if (line.trim() === "") {
    //         if (paragraph.length > 0) {
    //             paragraphs.push(paragraph);
    //             paragraph = [];
    //         }
    //     } else {
    //         // parseInline(line);
    //         if (_.startsWith(line, "* ")) {
    //             paragraph.push(<Line>{
    //                 kind: "li",
    //                 text: parseInline(line.substring(2))
    //             });
    //         } else if (_.startsWith(line, "#:: ")) {
    //             paragraph.push(<Line>{
    //                 kind: "egt",
    //                 text: parseInline(line.substring(4))
    //             });
    //         } else if (_.startsWith(line, "#: ")) {
    //             paragraph.push(<Line>{
    //                 kind: "eg",
    //                 text: parseInline(line.substring(3))
    //             });
    //         } else if (_.startsWith(line, "# ")) {
    //             paragraph.push(<Line>{
    //                 kind: "dd",
    //                 text: parseInline(line.substring(2))
    //             });
    //         } else {
    //             // p
    //             if (line.trim() === "") {
    //                 if (paragraph) {
    //                     paragraphs.push(paragraph);
    //                     paragraph = [];
    //                 }
    //             } else {
    //                 paragraph.push(<Line>{
    //                     kind: "p",
    //                     text: parseInline(line)
    //                 });
    //             }
    //         }
    //     }
    // });

    text.split("\n").forEach((line) => {
        if (line.trim() === "") {
            if (paragraph.length > 0) {
                paragraphs.push(paragraph);
                paragraph = [];
            }
        } else {
            paragraph.push(line);
        }
    });

    if (paragraph.length > 0)
        paragraphs.push(paragraph);
    // console.log(paragraphs);
    return paragraphs;
    // return _.compact(paragraphs.map(_.compact));
}
//
// function parseLink(text: RawText): Link {
//     const result = text.match(linkRegex);
//     if (result) {
//         return {
//             kind: "a",
//             text: result[1],
//             rename: result[2]
//         }
//     }
// }
//
// function parseItalic(text: RawText): InlineSimple {
//     const result = text.match(italicRegex);
//     if (result) {
//         return {
//             kind: "i",
//             text: result[1]
//         }
//     }
// }
//
// function parseBold(text: RawText): InlineSimple {
//     const result = text.match(boldRegex);
//     if (result) {
//         return {
//             kind: "b",
//             text: result[1]
//         }
//     }
// }
//
// function parseTemplate(text: RawText): Template {
//     const result = text.match(templateShellRegex);
//     if (result) {
//         // result[1].split("|")
//         return {
//             kind: "t",
//             name: "test",
//             params: [],
//             named: {}
//         }
//     }
// }

function parseInline(text: RawText): Inline[] {
    let inlines = [];
    let remaining = text;
    console.log(text)
    while (remaining.length > 0) {
        const result = remaining.match(inlineRegex);
        if (result) {
            const spaces = result[1];
            let cut: string = spaces + result[0];
            // console.log(cut);
            // console.log(i);
            if (result[2]) {
                inlines.push({
                    kind: "t",
                    name: cut
                })
            } else if (result[3]) {
                inlines.push(<Link>{
                    kind: "a",
                    text: cut
                })
            } else if (result[4]) {
                inlines.push({
                    kind: "i",
                    text: cut
                })
            } else if (result[5]) {
                inlines.push({
                    kind: "b",
                    text: cut
                })
            }
            remaining = remaining.substr(cut.length);
        } else {
            const indexLink = remaining.indexOf("[[");
            const indexTemplate = remaining.indexOf("{{");
            const indexItalic = remaining.indexOf("''");
            const indices = [indexLink, indexTemplate, indexItalic];
            // the whole line is a pure <span>
            if (_.every(indices, (x) => x === -1)) {
                console.log(`indices: ${indices}`)
                inlines.push({
                    kind: "span",
                    text: remaining
                });
                remaining = "";
            } else {
                let min = _.min(indices.filter((x) => x >= 0));
                if (min === 0) {
                    console.log(`min ${min}, indices: ${indices}`)
                    console.log(`text: [${remaining}]`);
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
//
// const linkRegex = /\[\[([^\]\|]+)|(?:\|([^\]]+))?\]\]/;
// const italicRegex = /''([^.]+)''/;
// const boldRegex = /'''([^.]+)'''/;
// const templateShellRegex = /\{\{([^\}]+)\}\}/;

    return inlines
}
//     return text;
    // console.log(text);
    // if (result) {
    //
    // } else {
    //
    // }
    // return [{
    //     kind: "span",
    //     text: text
    // }]



    // return parseItalic(text) || parseBold(text) || parseLink(text) || parseTemplate(text) || <InlineSimple>{
    //     kind: "span",
    //     text: text
    // }
// }

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
