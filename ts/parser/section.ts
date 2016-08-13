import * as P from "parsimmon";
import * as _ from "lodash";
import { Section, RawText } from "./../type";

const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
const h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
const interlangRegex = /((?:\[\[\w+\:[^\]]*\]\]\n)*)$/

// helper functions
function split(text: RawText, regex: RegExp): {
    paragraph: string,
    sections: Section<RawText>[]
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

function removeComments(text: RawText): RawText {
    return text.replace(/<!--[-.\n]*-->/g, "")
}

function removeInterLangLink(text: RawText): RawText {
    return text.replace(/((?:\[\[\S+\:\S+\]\]\n?)+$)/g, "");
}

// parses an entry into sections of structured RawText
function parseEntry(header: string, text: RawText): Section<RawText> {
    const processed = removeInterLangLink(removeComments(text));
    return parseSection(header, header, processed, [h2regex, h3regex, h4regex, h5regex]);
}

// parses a piece of RawText into sections of structured RawText
function parseSection(entryWord: string, header: string, text: RawText, regexs: RegExp[]): Section<RawText> {
    if (regexs.length === 0) {
        return {
            entryWord: entryWord,
            header: header,
            body: text
                .split(/\n\n/)
                .filter((text) => text.trim())
                .map((text) => "\n" + text),
            subs: []
        };
    } else {
        let result = {
            entryWord: entryWord,
            header: header,
            body: undefined,
            subs: []
        };
        let splittedChunks = text.split(regexs[0]);
        let index = 0;
        for (let chunk of splittedChunks) {
            if (index === 0) {
                result.body = chunk
                    .split(/\n\n/)
                    .filter((text) => text.trim())
                    .map((text) => "\n" + text);
            }
            if (index % 2 === 1) {
                result.subs.push(parseSection(entryWord, chunk, splittedChunks[index + 1], _.tail(regexs)));
            }
            index++;
        }
        return result;
    }
}


export {
    parseEntry
}
