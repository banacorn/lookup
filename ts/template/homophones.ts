import * as _ from "lodash";
import { AST, Fmt } from "../type";
import { sortParams } from "../template";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:homophones
// {{homophones|bous|bout|lang=fr}}
function homophones(word: string, raw: AST.Parameter[]): Fmt {
    const {named, unnamed} = sortParams(raw, word);

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
