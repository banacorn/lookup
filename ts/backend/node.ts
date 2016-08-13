import * as _ from "lodash";
import { parseParagraph } from "../parser/element";
import { parseEntry } from "../parser/section";
import { formatParagraph } from "../fmt";
import { flattenSection, Section, Fmt, RawText, mapSection, ParsedParagraph } from "../type";
// import { inspect } from "util";
// const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);

import "colors";


function printEntry(entry: Section<Fmt>) {
    const sections = flattenSection(entry);
    sections.forEach((section) => {
        console.log(`== ${section.header} ==`.yellow);
        section.body.forEach((paragraph) => {
            printFmt(paragraph)
        })
    })
}

function printFmt(fmt: Fmt) {
    let text = ""
    const texts = fmt.map((seg) => {
        let result = seg.text || "";
        if (seg.style.i)
            result = result["italic"];
        if (seg.style.b)
            result = result["bold"];
        if (seg.style.a)
            result = result["underline"];
        text += result;
    })

    console.log(text);
}


function parseAndFormat(word: string, body: RawText): Section<Fmt> {
    const rawEntry: Section<RawText> = parseEntry(word, body);
    const parsedEntry: Section<ParsedParagraph> = mapSection(parseParagraph)(rawEntry);
    return mapSection(formatParagraph(word))(parsedEntry);
}

export {
    printEntry,
    parseAndFormat
}
