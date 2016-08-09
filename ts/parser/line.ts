import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";
import { Inline, Plain, Bold, Italic, Link, Template, Parameter, Line } from "./../types";
import { before, beforeWhich, muchoPrim } from "./combinator";
import { inspect } from "util";
import "colors";
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
const insideTemplate = (x: AllowedParsers) => x ^ Allowed.Template

function debug<T>(x: T): T {
    console.log(inspect(x, false, null).cyan)
    return x;
}

function allowedParsers(allowed: AllowedParsers): Parser<Inline>[] {
    var parsers: Parser<Inline>[] = [];
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
    var result = ["''", "'''", "[[", "{{"];

    // codas
    if (!(allowed & Allowed.Link)) {
        result.push("]]");
        result.push("|");
    }
    if (!(allowed & Allowed.Template)) {
        result.push("}}");
        result.push("|");
    }

    return result;
}

function muchoInline(parsers: Parser<Inline>[], codaParser: Parser<any>): Parser<Inline[]> {
    return muchoPrim([], parsers, codaParser, (x) => {
        if (x.kind === "plain") {
            const apoInitial = /^'/.test(x.text);
            return x.text.length > 0 && !apoInitial;
        } else if (x.kind === "template") {
            return true;
        } else {
            return x.subs.length > 0;
        }
    });
}

const plain = (s: string) => <Plain>{
    kind: "plain",
    text: s
}

function parseInlines(allowed: AllowedParsers, codaParser: Parser<any>): Parser<Inline[]> {
    return <Parser<Inline[]>>P.lazy(() => {
        const parsers = allowedParsers(allowed);
        // console.log(`*** ${showAllowed(allowed)}`.cyan)
        return muchoInline(parsers, codaParser);
    });
}

function parsePlain(allowed: AllowedParsers): Parser<Plain> {
    // console.log(`plain ${showAllowed(allowed)}`.gray);
    // console.log(`codas ${codaParsers(allowed)}`.gray)
    return P.alt(
        before(stopParsers(allowed)),
        P.all
    ).map((chunk) => {
        return <Plain>{
            kind: "plain",
            text: chunk
        }
    });
}

function parseItalic(allowed: AllowedParsers): Parser<Italic> {
    // console.log(`italic ${showAllowed(allowed)}`.yellow);
    return P.seq(
        P.string("''"),
        parseInlines(insideItalic(allowed), P.string("''"))
    ).map((chunk) => {
        return <Italic>{
            kind: "italic",
            subs: chunk[1]
        };
    });
}

function parseBold(allowed: AllowedParsers): Parser<Bold> {
    // console.log(`bold ${showAllowed(allowed)}`.yellow);
    return P.seq(
        P.string("'''"),
        parseInlines(insideBold(allowed), P.string("'''"))
    ).map((chunk) => {
        return <Bold>{
            kind: "bold",
            subs: chunk[1]
        };
    });
}


//
//  Links
//

const parseFreeLink: Parser<Link> = P.seq(
        P.string("[["),
        before(["]]"]),
        P.string("]]")
    ).map((chunk) => {
        return <Link>{
            kind: "link",
            subs: [plain(chunk[1])]
        };
    });

function parseRenamedLink(allowed: AllowedParsers): Parser<Link> {
    return P.seq(
        P.string("[["),
        before(stopParsers(insideLink(allowed))),
        P.string("|"),
        parseInlines(insideLink(allowed), P.string("]]"))
    ).map((chunk) => {
        return <Link>{
            kind: "link",
            subs: chunk[3]
        };
    });
}

// Automatically hide stuff in parentheses
const parseARLHideParentheses: Parser<Link> = P.seq(
        before(["("]),
        P.string("("),
        before([")"]),
        P.string(")"),
        P.optWhitespace
    ).map((chunk) => {
        return <Link>{
            kind: "link",
            subs: [plain(chunk[0].trim())]
        };
    });

// Automatically hide the comma and following text
const parseARLHideComma: Parser<Link> = P.seq(
        before([","]),
        P.string(","),
        before(["|"])
    ).map((chunk) => {
        return <Link>{
            kind: "link",
            subs: [plain(chunk[0].trim())]
        };
    });

// Automatically hide namespace
const parseARLHideNamespace: Parser<Link> = P.seq(
        before([":"]),    // namespace
        P.string(":"),
        before(["|"])     // renamed
    ).map((chunk) => {
        return <Link>{
            kind: "link",
            subs: [plain(chunk[2])]
        };
    });

// Automatically hide namespace AND stuffs in parantheses
const parseARLHideNamespaceAndParantheses: Parser<Link> = P.seq(
        before([":"]),    // namespace
        P.string(":"),
        parseARLHideParentheses
    ).map((chunk) => {
        return <Link>{
            kind: "link",
            subs: chunk[2].subs
        };
    });

const parseAutoRenamedLink: Parser<Link> = P.seq(
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

function parseUnblendedLink(allowed: AllowedParsers): Parser<Link> {
    return P.alt(
        parseAutoRenamedLink,
        parseRenamedLink(allowed),
        parseFreeLink
    );
}

function parseLink(allowed: AllowedParsers): Parser<Link> {
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
function parseParameter(allowed: AllowedParsers, coda: string): Parser<Parameter> {
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
            return P.fail<Parameter>("");
        }
    })
    .or(parseInlines(insideTemplate(allowed), P.string(coda)).map((value) => {
        return {
            name: "",
            value: value
        }
    }))
}


function parseComplexTemplate(allowed: AllowedParsers): Parser<Template> {
    return P.seq(
        before(["|"]),
        P.string("|"),
        parseParameter(allowed, "|").many(),
        parseParameter(allowed, "}}")
    ).map((chunk) => {
        return <Template>{
            kind: "template",
            name: chunk[0],
            params: _.concat(chunk[2], [chunk[3]])
        };
    });
}

const parseSimpleTemplate: Parser<Template> = P.seq(
        before(["}}"]),
        P.string("}}")
    ).map((chunk) => {
        return <Template>{
            kind: "template",
            name: chunk[0],
            params: []
        };
    })


function parseTemplate(allowed: AllowedParsers): Parser<Template> {
    return P.string("{{").then(P.alt(
        parseComplexTemplate(allowed),
        parseSimpleTemplate
    ));
}

const parseText = parseInlines(15, P.alt(P.eof, P.string("\n")));

export {
    parseText,
    parseInlines
}
