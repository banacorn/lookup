import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";
import { Line, Paragraph, Section, RawText, ParseResult, ParseOk, ParseErr, Inline } from "./../type";
import { parseElements, plain } from "./element";

const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
const h5regex = /\=\=\=\=\=([^\=]+)\=\=\=\=\=\s/g;
const interlangRegex = /((?:\[\[\w+\:[^\]]*\]\]\n)*)$/

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

// remove inter language links
function parseEntry(header: string, text: RawText): Section {
    const result = text.match(interlangRegex);
    const trimmedText = text.substring(0, text.length - result[1].length);
    return collectSections(header, text, [h2regex, h3regex, h4regex, h5regex]);
}

function parseParagraph(text: RawText): ParseResult<Paragraph> {
    const prefixRegex = /(.*)\n(#*)(\**)(\:*) ?(.*)/;
    const result = parseElements.parse(text);
    if (result.status) {
        const prefixes = result.value.map((element, i) => {
            if (element.kind === "plain") {
                const match = element.text.match(prefixRegex)
                if (match) {
                    return {
                        oli: match[2].length,
                        uli: match[3].length,
                        indent: match[4].length,
                        // the position in "result.value: Inline[]"
                        index: i,
                        // since the line prefix may appear in the middle of a
                        // plain text, we need to sperate them from the prefix
                        before: match[1],
                        after: match[5]
                    }
                }
            }
        }).filter(x => x);

        let lines: Line[] = [];
        prefixes.forEach((prefix, i) => {
            // if there's the next index
            //      then [prefix.after] ++ result.value[prefix.index + 1 .. nextIndex] ++ [nextIndex.before] will be a new line
            //      else result.value[prefix.index .. ] with be a new line
            if (i < prefixes.length - 1) {
                const next = prefixes[i + 1];
                const segment = result.value.slice(prefix.index + 1, next.index)
                let mergedLine: Inline[] = segment;
                if (prefix.after)
                    mergedLine = _.concat([plain(prefix.after)], mergedLine);
                if (next.before)
                    mergedLine = _.concat(mergedLine, [plain(next.before)]);
                lines.push({
                    oli: prefix.oli,
                    uli: prefix.uli,
                    indent: prefix.indent,
                    line: mergedLine
                })
            } else {
                const segment = result.value.slice(prefix.index + 1)
                let mergedLine: Inline[] = segment;
                if (prefix.after)
                    mergedLine = _.concat([plain(prefix.after)], mergedLine);
                lines.push({
                    oli: prefix.oli,
                    uli: prefix.uli,
                    indent: prefix.indent,
                    line: mergedLine
                })
            }
        });
        return <ParseOk<Line[]>>{
            kind: "ok",
            value: lines
        };
    } else {
        return {
            kind: "err",
            error: `index: ${result.index.toString()}`
        }
    }
}

// preprocessors

function removeComments(text: RawText): RawText {
    return text.replace(/<!--[-.\n]*-->/g, "")
}

function removeInterLangLink(text: RawText): RawText {
    return text.replace(/((?:\[\[\S+\:\S+\]\]\n?)+$)/g, "");
}


function parseParagraphs(text: RawText): ParseResult<Paragraph>[] {
    return removeInterLangLink(removeComments(text))
        .split(/\n\n/)
        .filter((text) => text.trim())
        .map((text) => parseParagraph("\n" + text))
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
    parseParagraph
}
