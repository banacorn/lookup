import * as P from "parsimmon";
import * as _ from "lodash";
import { Parser } from "parsimmon";
import { AST, RawText, ParsedParagraph } from "./../type";
import { before, beforeWhich, muchoPrim } from "./combinator";
// import { inspect } from "util";
// import "colors";



// Bit order: template, link, bold, italic
type AllowedParsers = number;
enum Allowed {
    Italic      = 1 << 0,
    Bold        = 1 << 1,
    Link        = 1 << 2,
    Template    = 1 << 3
}

const insideItalic   = (x: AllowedParsers) => x ^ Allowed.Italic
const insideBold     = (x: AllowedParsers) => x ^ Allowed.Bold
const insideLink     = (x: AllowedParsers) => x ^ Allowed.Link ^ Allowed.Template
const insideTemplate = (x: AllowedParsers) => x
// const insideTemplate = (x: AllowedParsers) => x ^ Allowed.Template

// function debug<T>(x: T): T {
//     console.log(inspect(x, false, null).cyan)
//     return x;
// }

function allowedParsers(allowed: AllowedParsers): Parser<AST.Inline>[] {
    var parsers: Parser<AST.Inline>[] = [];
    if (allowed & Allowed.Template)
        parsers.push(parseTemplate(allowed))
    if (allowed & Allowed.Link)
        parsers.push(parseLink(allowed))
    if (allowed & Allowed.Bold)
        parsers.push(parseBold(allowed))
    if (allowed & Allowed.Italic)
        parsers.push(parseItalic(allowed))

    parsers.push(parsePlain(allowed));
    return parsers
}

function stopParsers(allowed: AllowedParsers): string[] {
    // initials
    var result = ["''", "'''", "[[", "{{", "}}", "|"];

    // codas
    if (!(allowed & Allowed.Link)) {
        result.push("]]");
        result.push("|");
    }
    if (!(allowed & Allowed.Template)) {
        result.push("}}");
        result.push("|");
    }

    // if(allowed ^ 15) {
        // result.push("\n* ");
    // }

    return result;
}

function muchoInline(parsers: Parser<AST.Inline>[], codaParser: Parser<any>): Parser<AST.Inline[]> {
    return muchoPrim([], parsers, codaParser, (x) => {
        if (x.kind === "plain") {
            const apoInitial = /^'/.test(x.text);
            return x.text.length > 0 && !apoInitial;
        } else if (x.kind === "template") {
            return true;
        } else if (x.kind === "prefix") {
            return true;
        } else {
            return x.subs.length > 0;
        }
    });
}

function parseInlines(allowed: AllowedParsers, codaParser: Parser<any>): Parser<AST.Inline[]> {
    return <Parser<AST.Inline[]>>P.lazy(() => {
        const parsers = allowedParsers(allowed);
        // console.log(`*** ${showAllowed(allowed)}`.cyan)
        return muchoInline(parsers, codaParser);
    });
}

function parsePlain(allowed: AllowedParsers): Parser<AST.Plain> {
    // console.log(`plain ${showAllowed(allowed)}`.gray);
    // console.log(`codas ${codaParsers(allowed)}`.gray)
    return P.alt(
        before(stopParsers(allowed)),
        P.all
    ).map((chunk) => {
        return <AST.Plain>{
            kind: "plain",
            text: chunk
        }
    });
}

function parseItalic(allowed: AllowedParsers): Parser<AST.Italic> {
    // console.log(`italic ${showAllowed(allowed)}`.yellow);
    return P.seq(
        P.string("''"),
        parseInlines(insideItalic(allowed), P.string("''"))
    ).map((chunk) => {
        return <AST.Italic>{
            kind: "italic",
            subs: chunk[1]
        };
    });
}

function parseBold(allowed: AllowedParsers): Parser<AST.Bold> {
    // console.log(`bold ${showAllowed(allowed)}`.yellow);
    return P.seq(
        P.string("'''"),
        parseInlines(insideBold(allowed), P.string("'''"))
    ).map((chunk) => {
        return <AST.Bold>{
            kind: "bold",
            subs: chunk[1]
        };
    });
}


//
//  Links
//

const parseFreeLink: Parser<AST.Link> = P.seq(
        P.string("[["),
        before(["]]"]),
        P.string("]]")
    ).map((chunk) => {
        return <AST.Link>{
            kind: "link",
            subs: [AST.plain(chunk[1])]
        };
    });

function parseRenamedLink(allowed: AllowedParsers): Parser<AST.Link> {
    return P.seq(
        P.string("[["),
        before(stopParsers(insideLink(allowed))),
        P.string("|"),
        parseInlines(insideLink(allowed), P.string("]]"))
    ).map((chunk) => {
        return <AST.Link>{
            kind: "link",
            subs: chunk[3]
        };
    });
}

// Automatically hide stuff in parentheses
const parseARLHideParentheses: Parser<AST.Link> = P.seq(
        before(["("]),
        P.string("("),
        before([")"]),
        P.string(")"),
        P.optWhitespace
    ).map((chunk) => {
        return <AST.Link>{
            kind: "link",
            subs: [AST.plain(chunk[0].trim())]
        };
    });

// Automatically hide the comma and following text
const parseARLHideComma: Parser<AST.Link> = P.seq(
        before([","]),
        P.string(","),
        before(["|"])
    ).map((chunk) => {
        return <AST.Link>{
            kind: "link",
            subs: [AST.plain(chunk[0].trim())]
        };
    });

// Automatically hide namespace
const parseARLHideNamespace: Parser<AST.Link> = P.seq(
        before([":"]),    // namespace
        P.string(":"),
        before(["|"])     // renamed
    ).map((chunk) => {
        return <AST.Link>{
            kind: "link",
            subs: [AST.plain(chunk[2])]
        };
    });

// Automatically hide namespace AND stuffs in parantheses
const parseARLHideNamespaceAndParantheses: Parser<AST.Link> = P.seq(
        before([":"]),    // namespace
        P.string(":"),
        parseARLHideParentheses
    ).map((chunk) => {
        return <AST.Link>{
            kind: "link",
            subs: chunk[2].subs
        };
    });

const parseAutoRenamedLink: Parser<AST.Link> = P.seq(
        P.string("[["),
        P.alt(
            parseARLHideNamespaceAndParantheses,
            parseARLHideNamespace,
            parseARLHideParentheses,
            parseARLHideComma
        ),
        P.string("|]]")
    ).map((chunk) => {
        return chunk[1]
    });

function parseUnblendedLink(allowed: AllowedParsers): Parser<AST.Link> {
    return P.alt(
        parseAutoRenamedLink,
        parseRenamedLink(allowed),
        parseFreeLink
    );
}

function parseLink(allowed: AllowedParsers): Parser<AST.Link> {
    return P.seq(
        parseUnblendedLink(allowed),
        P.letters
    ).map((chunk) => {
        if (chunk[0].subs) {
            if (chunk[1].length > 0) {
                chunk[0].subs.push({
                    kind: "plain",
                    text: chunk[1]
                })
            }
        } else {
            chunk[0].subs = [{
                kind: "plain",
                text: chunk[0].text + chunk[1]
            }]
        }
        return chunk[0];
    });
}

//
//  Template
//
function parseParameter(allowed: AllowedParsers, coda: string): Parser<AST.Parameter<AST.Inline>> {
    // get the string before "=" or the coda, which in case may be a name or an unnamed value
    return beforeWhich(["=", coda]).chain(([unknown, which]) => {
        if (which === "=") {    // named
            return P.string("=").then(parseInlines(insideTemplate(allowed), P.string(coda)).map((value) => {
                return {
                    name: unknown,
                    value: value
                }
            }));
        } else {    // unnamed, unwind and parse it with parseInlines again
            return P.fail<AST.Parameter<AST.Inline>>("");
        }
    })
    .or(parseInlines(insideTemplate(allowed), P.string(coda)).map((value) => {
        return {
            name: "",
            value: value
        }
    }))
}


function parseComplexTemplate(allowed: AllowedParsers): Parser<AST.Template> {
    return P.seq(
        before(["|"]),
        P.string("|"),
        parseParameter(allowed, "|").many(),
        parseParameter(allowed, "}}")
    ).map((chunk) => {
        return <AST.Template>{
            kind: "template",
            name: chunk[0],
            params: _.concat(chunk[2], [chunk[3]])
        };
    });
}

const parseSimpleTemplate: Parser<AST.Template> = P.seq(
        before(["}}"]),
        P.string("}}")
    ).map((chunk) => {
        return <AST.Template>{
            kind: "template",
            name: chunk[0],
            params: []
        };
    })


function parseTemplate(allowed: AllowedParsers): Parser<AST.Template> {
    return P.string("{{").then(P.alt(
        parseComplexTemplate(allowed),
        parseSimpleTemplate
    ));
}

////////////////////////////////////////////////////////////////////////////////
// Paragraph
////////////////////////////////////////////////////////////////////////////////

function parseParagraph(text: RawText): ParsedParagraph {
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

        let lines: AST.Line[] = [];
        prefixes.forEach((prefix, i) => {
            // if there's the next index
            //      then [prefix.after] ++ result.value[prefix.index + 1 .. nextIndex] ++ [nextIndex.before] will be a new line
            //      else result.value[prefix.index .. ] with be a new line
            if (i < prefixes.length - 1) {
                const next = prefixes[i + 1];
                const segment = result.value.slice(prefix.index + 1, next.index)
                let mergedLine: AST.Inline[] = segment;
                if (prefix.after)
                    mergedLine = _.concat([AST.plain(prefix.after)], mergedLine);
                if (next.before)
                    mergedLine = _.concat(mergedLine, [AST.plain(next.before)]);
                lines.push({
                    oli: prefix.oli,
                    uli: prefix.uli,
                    indent: prefix.indent,
                    line: mergedLine
                })
            } else {
                const segment = result.value.slice(prefix.index + 1)
                let mergedLine: AST.Inline[] = segment;
                if (prefix.after)
                    mergedLine = _.concat([AST.plain(prefix.after)], mergedLine);
                lines.push({
                    oli: prefix.oli,
                    uli: prefix.uli,
                    indent: prefix.indent,
                    line: mergedLine
                })
            }
        });
        // return <ParseOk<AST.Line[]>>{
        return {
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

// const parseOLI: Parser<number> = P.string("#").many().map(chunk => chunk[0].length);
// const parseULI: Parser<number> = P.string("*").many().map(chunk => chunk[0].length);
// const parseIndent: Parser<number> = P.string(":").many().map(chunk => chunk[0].length);

// const parsePrefix: Parser<Prefix> = P
//     .regex(/\n?/)
//     .then(parseOLI
//     .chain(oli => parseULI
//     .chain(uli => parseIndent
//     .chain(indent => {
//         if (oli + uli + indent > 0)
//             return P.string(" ")
//                 .then(P.succeed(<Prefix>{
//                     kind:   "prefix",
//                     oli:    oli,
//                     uli:    uli,
//                     indent: indent
//                 }));
//         else
//             return P.succeed(<Prefix>{
//                 kind:   "prefix",
//                 oli:    0,
//                 uli:    0,
//                 indent: 0
//             });
//     }))));

const parseElements = parseInlines(15, P.alt(P.eof));


export {
    parseElements,
    parseParagraph
}
