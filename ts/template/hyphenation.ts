import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";
import { find } from "../template";

// https://en.wiktionary.org/wiki/Template:hyphenation
// {{hyphenation|knowl|edge|caption=Hyphenation US|lang=en}}
function hyphenation(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    let result = [];

    // caption
    find(named, "caption", (value) => {
        result = F.add(result, `${F.extractText(value)}: `);
    }, () => {
        result = F.add(result, `Hyphenation: `);
    })

    // hyphenation
    unnamed.forEach((segment, i) => {
        if (i !== 0)
            result = F.add(result, `‧`);
        result = F.add(result, `${F.extractText(segment)}`);
    });

    return result
}

export default hyphenation;
