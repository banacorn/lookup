import { settings } from "./content";

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
    section.body.forEach((paragraph) => {
        fmt = appendFmt(fmt, fmtParagraph(paragraph));
        fmt.text += "\n";
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
    return {
        text: line,
        style: []
    }
}

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

function printEntry(entry: Section) {
    // if there's such entry
    if (entry) {

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
