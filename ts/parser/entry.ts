import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";
import { Line, Paragraph, Section, RawText } from "./../types";

const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
const h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
const interlangRegex = /((?:\[\[\w+\:[^\]]*\]\]\n)*)$/
// remove inter language links
function parseEntry(header: string, text: RawText): Section {
    const result = text.match(interlangRegex);
    const trimmedText = text.substring(0, text.length - result[1].length);
    return parseSection(header, trimmedText);
}

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

function removeComments(text: RawText): RawText {
    return text.replace(/<!--[-.\n]*-->/g, "")
}

function parseParagraphs(text: RawText): Paragraph[] {
    // console.log(text)
    return removeComments(text)
        .split(/\n\n/)
        .filter((text) => text.trim())
        .map((text) => `${text}`)
    // processed.forEach((paragraph) => {
    //     paragraphs.push(paragraph);
    //     // console.log(`[%c${line}%c]`, `color: orange`, `color: black`)
    //     // console.log(`${line}`);
    // })
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
    parseEntry,
    parseSection
}
