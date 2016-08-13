import * as _ from "lodash";
import { parseParagraph } from "../parser/element";
import { parseEntry } from "../parser/section";
import { formatParagraph } from "../fmt";
import { Section, Fmt, RawText, mapSection, ParsedParagraph } from "../type";

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
function shouldCollapse(settings: any, name: string): boolean {
    return settings.collapse[_.camelCase(name)]
        || (settings.collapse.partOfSpeech && isPartOfSpeech(name));
}

function printHeader(settings: any, name: string) {
    if (shouldCollapse(settings, name))
        console.groupCollapsed(name);
    else
        console.group(name);
}

function printSection(settings: any, section: Section<Fmt>) {
    // let formatted = formatSection(section);
    if (section.body.length) {
        section.body.forEach((paragraph) => {
            printFmt(paragraph);
            console.log("\n");
        })
    }

    for (let sub of section.subs) {
        printHeader(settings, sub.header);
        printSection(settings, sub);
        console.groupEnd();
    }
}

function printEntry(settings: any, entry: Section<Fmt>) {
    // if there's such entry
    if (entry) {
        // display all languages
        if (settings.displayAllLanguages) {
            printSection(settings, entry);
        } else {
            // find the specified language (nullable)
            const languageEntry = _.find(entry.subs, { header: settings.language });
            if (languageEntry) {
                printSection(settings, languageEntry);
            } else {
                console.warn("No such entry for " + settings.language);
            }
        }
    } else {
        console.warn("Not found");
    }
}

function printFmt(fmt: Fmt) {
    // texts interspersed by style placeholders "%c"
    const texts = "%c" + fmt.map(x => x.text).join("%c");
    // translate style tags to css
    const styles = fmt.map((seg) => {
        let css = "";
        if (seg.style.i)
            css += "font-style: italic;";
        if (seg.style.b)
            css += "font-weight: bold;";
        if (seg.style.a)
            css += "text-decoration; underline;";
        return css;
    })
    // print it all out
    console.log.apply(console, [texts].concat(styles));
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
