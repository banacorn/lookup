import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";

import { parseInlines, fromString } from "./inline";
import { before } from "./combinator";

//
//  Templates
//

function parseParameter(coda: string): Parser<Parameter> {
    // get the string before "=" or the coda, which in case may be a name or an unnamed value
    return before(["=", coda]).chain((unknown) => {
        return P.string("=")
            .then(parseInlines(P.string(coda), [coda]).map((value) => {  // named
                return {
                    name: unknown,
                    value: value
                }
            }))
            .or(P.string(coda).then(P.succeed({     // unnamed
                name: "",
                value: fromString(unknown)
            })))
    })
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

export {
    parseTemplate
}
