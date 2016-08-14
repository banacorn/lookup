import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:rhymes
// {{rhymes|ɪsən|lang=en}}
function rhymes(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    let result = [F.seg(`Rhymes: `)];

    // rhymes
    unnamed.forEach((rhyme, i) => {
        if (i !== 0)
            result = F.add(result, `, `);
        result = F.add(result, `-${F.extractText(rhyme)}`, false, true);
    });
    return result
}

export default rhymes;
