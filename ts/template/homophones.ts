import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:homophones
// {{homophones|bous|bout|lang=fr}}
function homophones(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {

    let result = [F.seg(`Homophones: `)];

    // homophones
    unnamed.forEach((homophone, i) => {
        if (i !== 0)
            result = F.add(result, `, `);
        result = F.add(result, `${F.extractText(homophone)}`);
    });
    return result
}

export default homophones;
