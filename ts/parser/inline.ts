import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";
import { before, beforeWhich, muchoPrim } from "./combinator";

function muchoInline(parsers: Parser<Inline>[], codaParser: Parser<any>): Parser<Inline[]> {
    return muchoPrim([], parsers, codaParser, (x) => {
        if (x.kind === "plain") {
            return x.text.length > 0;
        } else if (x.kind === "t") {
            return true;
        } else {
            return x.subs.length > 0;
        }
    });
}

function fromString(s: string): Plain {
    return <Plain>{
        kind: "plain",
        text: s
    }
}

function parseInlines(codaParser: Parser<any>, plainCoda: string[] = []): Parser<Inline[]> {
    return <Parser<Inline[]>>P.lazy(() => {
        const defaultPlainCodas = ["[[", "'''", "''", "{{", "\n"];
        return muchoInline([
            parseBold(plainCoda),
            parseItalic(plainCoda),
            parseLink,
            parseTemplate,
            parsePlain(_.concat(defaultPlainCodas, plainCoda))
        ], codaParser);
    });
}


function parsePlain(stops: string[]): Parser<Plain> {
    return P.alt(
        before(stops),
        P.all
    ).map((chunk) => {
        return <Plain>{
            kind: "plain",
            text: chunk
        }
    });
}

function parseItalic(plainCoda: string[] = []): Parser<Italic> {
    return P.seq(
        P.string("''"),
        parseInlines(P.string("''"), plainCoda)
    ).map((chunk) => {
        return <Italic>{
            kind: "i",
            subs: chunk[1]
        };
    });
}

function parseBold(plainCoda: string[] = []): Parser<Bold> {
    return P.seq(
        P.string("'''"),
        parseInlines(P.string("'''"), plainCoda)
    ).map((chunk) => {
        return <Bold>{
            kind: "b",
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
            kind: "a",
            subs: [fromString(chunk[1])]
        };
    });

const parseRenamedLink: Parser<Link> = P.seq(
        P.string("[["),
        before(["|"]),
        P.string("|"),
        parseInlines(P.string("]]"), ["]]"])
    ).map((chunk) => {
        return <Link>{
            kind: "a",
            subs: chunk[3]
        };
    });

// Automatically hide stuff in parentheses
const parseARLHideParentheses: Parser<Link> = P.seq(
        before(["("]),
        P.string("("),
        before([")"]),
        P.string(")"),
        P.optWhitespace
    ).map((chunk) => {
        return <Link>{
            kind: "a",
            subs: [fromString(chunk[0])]
        };
    });

// Automatically hide the comma and following text
const parseARLHideComma: Parser<Link> = P.seq(
        before([","]),
        P.string(","),
        before(["|"])
    ).map((chunk) => {
        return <Link>{
            kind: "a",
            subs: [fromString(chunk[0])]
        };
    });

// Automatically hide namespace
const parseARLHideNamespace: Parser<Link> = P.seq(
        before([":"]),    // namespace
        P.string(":"),
        before(["|"])     // renamed
    ).map((chunk) => {
        return <Link>{
            kind: "a",
            subs: [fromString(chunk[2])]
        };
    });

// Automatically hide namespace AND stuffs in parantheses
const parseARLHideNamespaceAndParantheses: Parser<Link> = P.seq(
        before([":"]),    // namespace
        P.string(":"),
        parseARLHideParentheses
    ).map((chunk) => {
        return <Link>{
            kind: "a",
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

const parseUnblendedLink: Parser<Link> = P.alt(
        parseAutoRenamedLink,
        parseRenamedLink,
        parseFreeLink
    );

const parseLink: Parser<Link> = P.seq(
        parseUnblendedLink,
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


function parseParameter(coda: string): Parser<Parameter> {
    // get the string before "=" or the coda, which in case may be a name or an unnamed value
    return beforeWhich(["=", coda]).chain(([unknown, which]) => {
        if (which === "=") {    // named
            return P.string("=").then(parseInlines(P.string(coda), [coda]).map((value) => {
                return {
                    name: unknown,
                    value: value
                }
            }));
        } else {    // unnamed, unwind and parse it with parseInlines again
            return P.fail<Parameter>("");
        }
    })
    .or(parseInlines(P.string(coda), [coda]).map((value) => {
        return {
            name: "",
            value: value
        }
    }))
}


const parseComplexTemplate: Parser<any> = P.seq(
        before(["|"]),
        P.string("|"),
        parseParameter("|").many(),
        parseParameter("}}")
    ).map((chunk) => {
        return <Template>{
            kind: "t",
            name: chunk[0],
            // params: chunk[2]
            params: _.concat(chunk[2], [chunk[3]])
        };
    })

const parseSimpleTemplate: Parser<Template> = P.seq(
        before(["}}"]),
        P.string("}}")
    ).map((chunk) => {
        return <Template>{
            kind: "t",
            name: chunk[0],
            params: []
        };
    })


const parseTemplate: Parser<any> = P.string("{{").then(P.alt(
        parseComplexTemplate,
        parseSimpleTemplate
    ));


const parseLine: Parser<Line> = P.seq(
        P.string("#").many(),
        P.string("*").many(),
        P.string(":").many(),
        P.optWhitespace,
        parseInlines(P.regex(/\n/))
    ).map((chunk) => {
        return {
            oli: chunk[0].length,
            uli: chunk[1].length,
            indent: chunk[2].length,
            line: chunk[4]
        }
    });

export {
    fromString,
    parseLine
}


// const testCase = [
//
//     // links
//
//     // "[[ Kingdom (biology) ]]",              // free link
//     // "[[ Seattle, Washington | Seattle ]]",  // renamed link
//     // "[[ Kingdom (biology) |]]",  // auto renamed link, parentheses
//     // "[[ Seattle, Washington |]]", // auto renamed link, comma
//     // "[[Wikipedia:Village pump|]]", // auto renamed link, namespace
//     // "[[Wikipedia:Manual of Style (headings)|]]", // auto renamed link, namespace & parantheses
//     // "[[Wikipedia:Manual of Style#Links|]]", // auto renamed link, namespace
//     //
//     // "[[public transport]]ation", // blend link
//     // "[[bus]]es", // blend link
//     //
//     "''San Francisco'' also has [[public transport]]ation. Examples include [[bus]]es, [[taxicab]]s, and [[tram]]s. {{adsf}}", // blend link
//
//     // "{{template name}}",
//     // "{{template | unnamed-value }}",
//     // "{{template | name = value asdf }}",
//     // "{{template | unnamed-value | name = value asdf }}",
//     // "{{template | name = value asdf | unnamed-value}}",
//
//     "{{template name| val0 | val1 | name=val }}"
// ];
