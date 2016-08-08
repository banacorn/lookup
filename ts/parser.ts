import * as _ from "lodash";
import * as P from "parsimmon";
import { Parser } from "parsimmon";
import { parseLine } from "./parser/inline";
import { RawText, Section, Paragraph } from "./types";

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

function removeComments(text: RawText): RawText {
    return text.replace(/<!--[-.\n]*-->/g, "")
}

function parseParagraphs(text: RawText): Paragraph[] {
    console.log(text)
    let paragraphs: Paragraph[] = [];

    const processed = removeComments(text)
        .split(/\n\n/)
        .filter((text) => text.trim())
        .map((text) => `\n${text}`)

    // console.log(processed)
    processed.forEach((line) => {
        console.log(`[%c${line}%c]`, `color: orange`, `color: black`)

    })
    // removeComments(text)
    //     .split(/\n\n/)
    //     .filter((text) => text.trim())
    //     .map((text) => text.replace(/\n/g, ""))
    //     .forEach((paragraph) => {
    //     console.log(`[%c${paragraph}%c]`, `color: orange`, `color: black`)
    //     // const result = parseLine.parse(line + "\n");
    //     // if (result.status) {
    //     //     console.log(`%csucceed`, `color: green`)
    //     //     // console.log(result.value)
    //     // } else {
    //     //     console.log(`[%c${line}%c]`, `color: orange`, `color: black`)
    //     //     console.log(`%cfailed`, `color: red`)
    //     //     console.log(result)
    //     // }
    // })
    // removeComments(text).split(/\n/).filter((x) => x.trim()).forEach((line) => {
    //     const result = parseLine.parse(line + "\n");
    //     if (result.status) {
    //         console.log(`%csucceed`, `color: green`)
    //         // console.log(result.value)
    //     } else {
    //         console.log(`[%c${line}%c]`, `color: orange`, `color: black`)
    //         console.log(`%cfailed`, `color: red`)
    //         console.log(result)
    //     }
    // })
    return paragraphs;
}


const testCases = [
    // "{{also|daß}}\n",
    // "{{also|anlage}}\n"
];

testCases.forEach((s) => {
    console.log(s)
    console.log(parseLine.parse(s))
});



// function parseLine(): Parser<Line> {
//
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

export {
    parseSection
}
