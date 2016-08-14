import * as _ from "lodash";
import { AST, Fmt } from "../type";
import { sortParams } from "../template";
import * as F from "../fmt";

// {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
function rhymes(word: string, raw: AST.Parameter[]): Fmt {
    const {named, unnamed} = sortParams(raw, word);

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
