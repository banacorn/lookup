import * as _ from "lodash";
import { AST } from "./type/ast";

type RawText = string;

////////////////////////////////////////////////////////////////////////////////
// Entry & Section
////////////////////////////////////////////////////////////////////////////////

type ParsedParagraph = ParseResult<AST.Paragraph>;
type Section<T> = {
    header: string,
    body: T[],
    subs: Section<T>[]
}

function mapSection<T, U>(f :(t: T) => U): ((t: Section<T>) => Section<U>) {
    return function(section: Section<T>): Section<U> {
        return {
            header: section.header,
            body: section.body.map(f),
            subs: section.subs.map(mapSection(f))
        }
    }
}

function flattenSection<T>(section: Section<T>): { header: string, body: T[]}[] {
    let bodies = [];
    bodies = _.concat(bodies, [{
        header: section.header,
        body: section.body
    }]);
    section.subs.forEach((sub) => {
        bodies = _.concat(bodies, flattenSection(sub));
    });
    return bodies;
}


//
//  Freaking Either
//
type ParseResult<T> = ParseOk<T> | ParseErr;

interface ParseOk<T> {
    kind: "ok";
    value: T;
}

interface ParseErr {
    kind: "err";
    error: string;
}

export * from "./type/ast";
export * from "./type/fmt";
export {
    RawText,
    Section, ParsedParagraph, mapSection, flattenSection,
    ParseResult, ParseOk, ParseErr
}
