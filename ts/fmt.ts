// import { Fmt, Paragraph, Section, RawText, ParseResult, ParseOk, ParseErr, Inline } from "./../type";
import * as _ from "lodash";
import { Fmt, Seg, Inline, Line, Paragraph, Section } from "./type";
import { transclude } from "./template";

let WORD;

//
//  Formatter
//

function extractText(fmt: Fmt): string {
    return fmt.map(x => x.text).join("");
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

// make all segments italic
function italic(fmt: Fmt): Fmt {
    return fmt.map((seg) => {
        seg.style.i = true;
        return seg;
    });
}

// make all segments bold
function bold(fmt: Fmt): Fmt {
    return fmt.map((seg) => {
        seg.style.b = true;
        return seg;
    });
}

// make all segments link-like
function link(fmt: Fmt): Fmt {
    return fmt.map((seg) => {
        seg.style.a = true;
        return seg;
    });
}


function add(fmt: Fmt, text: string, i: boolean = false, b: boolean = false, a: boolean = false): Fmt {
    if (fmt.length === 0) {
        return [{
            text: text,
            style: { i: i, b: b, a: a }
        }];
    } else {
        const lastIndex = fmt.length - 1;
        const style = { i: i, b: b, a: a };
        // the style of newly added text is the same as the last segment, simply append them
        if (_.isEqual(fmt[lastIndex].style, style)) {
            fmt[lastIndex].text += text;
            return fmt;
        } else {
            return fmt.concat([{
                text: text,
                style: style
            }]);
        }
    }
}

function concat(a: Fmt, b: Fmt): Fmt {
    if (a.length === 0) {
        return b;
    } else if (b.length === 0) {
        return a;
    } else {
        if (_.isEqual(a[a.length - 1].style, b[0].style)) {
            return a.slice(0, a.length - 1).concat([{
                text: a[a.length - 1].text + b[0].text,
                style: b[0].style
            }]).concat(b.slice(1));
        } else {
            return a.concat(b);
        }
    }
}

function fold(fmt: Fmt, elements: Inline[], f?: (x: Fmt) => Fmt): Fmt {
    if (f) {
        elements.forEach((e) => {
            fmt = concat(fmt, f(formatElement(e)));
        });
    } else {
        elements.forEach((e) => {
            fmt = concat(fmt, formatElement(e));
        });
    }
    return fmt;
}

//
//  Formatting stuffs
//

function formatElement(element: Inline): Fmt {
    switch (element.kind) {
        case "plain":
            let fmt = [];
            return add([], element.text);
        case "italic":
            return fold([], element.subs, italic);
        case "bold":
            return fold([], element.subs, bold);
        case "link":
            return fold([], element.subs, link);
        case "template":
            const transclusion = transclude(WORD, element);
            if (transclusion) {
                return transclusion;
            } else {
                fmt = add([], `{{${element.name}`);
                element.params.forEach((param) => {
                    if (param.name) {       // named
                        fmt = add(fmt, `|${param.name}=`);
                        fmt = fold(fmt, param.value);
                    } else {                // unnamed
                        fmt = add(fmt, `|`);
                        fmt = fold(fmt, param.value);
                    }
                });
                fmt = add(fmt, `}}`);
                return fmt
            }
    }
}


function formatLine(line: Line, order: number): Fmt {
    // ### only
    const numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
    // ends with *
    const hasBullet = line.uli > 0 && line.indent === 0;
    let bullet = "◦";
    if (line.uli % 2)
        bullet = "•";
    // const indentSpace = 4;
    const indentLevel = line.oli + line.uli + line.indent;
    const indentation = _.repeat("  ", indentLevel);

    const formattedElements: Fmt = fold([], line.line);
    if (numbered) {
        return concat([{
            text: `${indentation}${order}. `,
            style: { i: false, b: true, a: false }
        }], formattedElements);
    } else if (hasBullet) {
        return concat([{
            text: `${indentation}${bullet} `,
            style: { i: false, b: false, a: false }
        }], formattedElements);
    } else {
        return concat([{
            text: `${indentation}`,
            style: { i: false, b: false, a: false }
        }], formattedElements);
    }
}


function formatParagraph(paragraph: Paragraph, word: string = "Unknown Entry"): Fmt {
    WORD = word;

    let fmt = [];

    let order = [1];
    paragraph.forEach((line) => {
        fmt = concat(fmt, formatLine(line, _.last(order)));
        fmt = add(fmt, "\n");
        const numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
        const level = line.oli;
        if (level > order.length)   // indent
            order.push(1);
        else if (level < order.length) {
            order.pop();
        }
    });
    return fmt;
}

function formatSection(section: Section): Fmt {
    let fmt = [];
    section.body.forEach((result) => {
        if (result.kind === "ok") {
            fmt = concat(fmt, formatParagraph(result.value));
            fmt = add(fmt, "\n");
        } else {
            fmt = add(fmt, "Paragraph parse error\n");
        }
    });
    return fmt;
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

function printSection(settings: any, section: Section) {
    let formatted = formatSection(section);
    if (formatted.length)
        printFmt(formatted);

    for (let sub of section.subs) {
        printHeader(settings, sub.header);
        printSection(settings, sub);
        console.groupEnd();
    }
}

function printEntry(settings: any, entry: Section) {
    WORD = entry.header;
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

//
//  Segment constructor
//

const seg = (s: string, i: boolean = false, b: boolean = false, a: boolean = false) => <Seg>{
    text: s,
    style: { i: i, b: b, a: a }
}


export {
    formatElement,
    formatLine,
    formatParagraph,
    formatSection,


    seg,

    concat,
    add,
    extractText,
    fold,

    printEntry
}
