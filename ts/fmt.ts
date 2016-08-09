import { settings } from "./content";
import * as _ from "lodash";
import { Fmt, Section, Paragraph, RawText, Line, Inline } from "./types";

function appendFmt(a: Fmt, b: Fmt) {
    return {
        text: a.text + b.text,
        style: a.style.concat(b.style)
    };
}

function printFmt(fmt: Fmt) {
    if (fmt.text.trim()) {
        console.log.apply(console, [fmt.text].concat(fmt.style));
    }
}


function isPartOfSpeech(name: string): boolean {
    return _.includes([
            // Parts of speech:
            "Adjective", "Adverb", "Ambiposition", "Article", "Circumposition",
            "Classifier", "Conjunction", "Contraction", "Counter", "Determiner",
            "Interjection", "Noun", "Numeral", "Participle", "Particle",
            "Postposition", "Preposition", "Pronoun", "Proper noun", "Verb",
            // Morphemes:
            "Circumfix", "Combining form", "Infix", "Interfix", "Prefix",
            "Root", "Suffix",
            // Symbols and characters:
            "Diacritical mark", "Letter", "Ligature", "Number",
            "Punctuation mark", "Syllable", "Symbol",
            // Phrases
            "Phrase", "Proverb", "Prepositional phrase",
            // Han characters and language-specific varieties:
            "Han character", "Hanzi", "Kanji", "Hanja",
            // Lojban-specific parts of speech
            "Brivla", "Cmavo", "Gismu", "Lujvo", "Rafsi",
            // Romanization
            "Romanization"
        ], name);
}

// a predicate that decides if a section should be collapsed
function shouldCollapse(name: string): boolean {
    return settings.collapse[_.camelCase(name)]
        || (settings.collapse.partOfSpeech && isPartOfSpeech(name));
}

function printHeader(name: string) {
    if (shouldCollapse(name))
        console.groupCollapsed(name);
    else
        console.group(name);
}

function printSection(section: Section) {
    printFmt(fmtSection(section));
    for (let sub of section.subs) {
        printHeader(sub.header);
        printSection(sub);
        console.groupEnd();
    }
}

function fmtSection(section: Section): Fmt {
    let fmt = {
        text: "",
        style: []
    }
    section.body.forEach((result) => {
        if (result.kind === "ok") {
            fmt = appendFmt(fmt, fmtParagraph(result.value));
            fmt.text += "\n";
        } else {
            fmt.text = `Paragraph parse error`;
        }
    });
    return fmt;
}

function fmtParagraph(paragraph: Paragraph): Fmt {
    let fmt = {
        text: "",
        style: []
    }
    paragraph.forEach((line) => {
        fmt = appendFmt(fmt, fmtLine(line));
        fmt.text += "\n";
    });
    return fmt;
}

function fmtLine(line: Line): Fmt {
    let fmt = {
        text: "",
        style: []
    }

    fmt.text += _.repeat("#", line.oli)
        + _.repeat("*", line.uli)
        + _.repeat(":", line.indent)
        + " ";

    const elements = line.line

    elements.forEach((element) => {
        fmt = appendFmt(fmt, fmtElement(element));
    });
    return fmt;
}

function fmtElement(element: Inline): Fmt {
    let fmt = {
        text: "",
        style: []
    }
    if (element.kind === "plain") {
        fmt.text += element.text;
    } else if (element.kind === "template") {
        fmt.text += `{{${element.name}`;
        element.params.forEach(param => {
            if (param.name) {   // named
                fmt.text += `|${param.name}=`;
                param.value.forEach((v) => {
                    fmt = appendFmt(fmt, fmtElement(v));
                });
            } else {            // unnamed
                fmt.text += `|`;
                param.value.forEach((v) => {
                    fmt = appendFmt(fmt, fmtElement(v));
                });
            }
        });
        fmt.text += `}}`;
    } else {
        element.subs.forEach((e) => {
            fmt = appendFmt(fmt, fmtElement(e));
        });
    }
    return fmt;
}

// function formatter<T>(f: (Fmt) => Fmt): Fmt {
//     let fmt = {
//         text: "",
//         style: []
//     }
//     return f(fmt);
// }
//
// const fmtElement = (element: Inline) => formatter((fmt) => {
//     if ()
//     return fmt;
// });
//
// const fmtPlain = (element: Inline.Plain) => formatter((fmt) => {
//     fmt.text += element.text;
//     return fmt;
// });
//
// const fmtBold = (element: Inline.Bold) => formatter((fmt) => {
//     element.subs.forEach((e) => {
//         fmt = appendFmt(fmt, fmtElement(e));
//     });
//     return fmt;
// });

// function fmtPlain(plain: Inline.Plain): Fmt {
//     let fmt = {
//         text: "",
//         style: []
//     }
//     return fmt;
// }


// console.log("normal %cbold %citalic", "font-weight: bold", "text-decoration: underline")

// function fmtBold(x: Bold): Fmt {
// }


// function fmtLine(line: Line): Fmt {
//
// }

// function formatLine(line: Line): Fmt {
//
//     let prefix = "";
//     switch (line.kind) {
//         case "li":
//             prefix = "• "
//             break;
//         case "dd":
//             prefix = "# "
//             break;
//         case "eg":
//             prefix = "    "
//             break;
//         case "egt":
//             prefix = "        "
//             break;
//     }
//
//     const fmt = formatInline(line.text);
//     return appendFmt(
//         { text: prefix, style: []},
//         fmt
//     );
// }
//
//
// function formatInline(items: Inline[]): Fmt {
//     let text = "";
//     let style = [];
//     items.forEach((item) => {
//         switch (item.kind) {
//             case "span":
//                 text += item.text;
//                 break;
//             case "i":
//                 text += `%c${item.text}`;
//                 style.push("font-style: italic");
//                 break;
//             case "b":
//                 text += `%c${item.text}`;
//                 style.push("font-style: bold");
//                 break;
//             case "a":
//                 text += `%c${item.text}`;
//                 style.push("text-decoration: underline");
//                 break;
//             case "t":
//                 text += `{{${item.name}}}`;
//                 break;
//         }
//     });
//     return {
//         text: text,
//         style: style
//     }
// }

function printEntry(settings: any, entry: Section) {
    // if there's such entry
    if (entry) {
        console.log(settings.displayAllLanguages)
        // display all languages
        if (settings.displayAllLanguages) {
            printSection(entry);
        } else {
            // find the specified language (nullable)
            const languageEntry = _.find(entry.subs, { header: settings.language });
            if (languageEntry) {
                printSection(languageEntry);
            } else {
                console.warn("No such entry for " + settings.language);
            }
        }
    } else {
        console.warn("Not found");
    }
}

export {
    printEntry
}
