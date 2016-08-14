import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:hyphenation
// {{hyphenation|knowl|edge|caption=Hyphenation US|lang=en}}
function hyphenation(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    let result = [];

    const caption = _.find(named, ["name", "caption"]);

    // caption
    if (caption && F.extractText(caption.value))
        result = F.add(result, `${F.extractText(caption.value)}: `);
    else
        result = F.add(result, `Hyphenation: `);

    // hyphenation
    unnamed.forEach((segment, i) => {
        if (i !== 0)
            result = F.add(result, `‧`);
        result = F.add(result, `${F.extractText(segment)}`);
    });

    return result
}

export default hyphenation;
