import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";
import { before } from "./combinator";
import { parseInlines, fromString } from "./inline";

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

export {
    parseLink
}
