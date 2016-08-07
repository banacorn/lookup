import * as _ from "lodash";
import * as P from "parsimmon";
import { Parser } from "parsimmon";

// * In counting, the form {{m|de|eins}} is used: '''''eins''' zu {{l|de|null}}'' − "one-nil" (sport result). The name of the number ''one'', as a noun, is {{m|de|Eins}}.
// * In order to distinguish the numeral ("one") from the indefinite article ("a, an"), the former may be printed in [[italics]]: Ich hatte nur ''ein'' Bier bestellt.

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
    return paragraphs;
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

export {
    parseSection
}
