import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";
import { before, muchoPrim } from "./combinator";
import { parseTemplate } from "./template";
import { parseLink } from "./link";

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

function parseInlines(codaParser: Parser<any>, plainCoda?: string[]): Parser<Inline[]> {
    return <Parser<Inline[]>>P.lazy(() => {
        return muchoInline([
            parseBold,
            parseItalic,
            parseLink,
            parseTemplate,
            parsePlain(_.concat(["[[", "'''", "''", "{{"], plainCoda))
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

const parseItalic: Parser<Italic> = P.seq(
        P.string("''"),
        parseInlines(P.string("''"))
    ).map((chunk) => {
        return <Italic>{
            kind: "i",
            subs: chunk[1]
        };
    });

const parseBold: Parser<Bold> = P.seq(
        P.string("'''"),
        parseInlines(P.string("'''"))
    ).map((chunk) => {
        return <Bold>{
            kind: "b",
            subs: chunk[1]
        };
    });

export {
    fromString,
    parseInlines
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
