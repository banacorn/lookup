import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";
import { find, findEnum } from "../template";

// https://en.wiktionary.org/wiki/Template:head
// {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
function head(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    let result = [];
    const dealtNames = [];

    // displayed headword
    find(named, "head", (value) => {
        result = F.add(result, `${F.extractText(value)} `, false, true);
        dealtNames.push("head");
    }, () => {
        result = F.add(result, `${word} `, false, true);
    });

    // gender
    findEnum(named, "g", (value, i, key) => {
        result = F.add(result, `${F.extractText(value)}`, true, false, true);
        dealtNames.push(key);
    });

    // display undealt parameters
    let undealt = `{{head`;
    unnamed.slice(2).forEach((value) => {
        undealt += `|${F.extractText(value)}`;
    });

    const undealtNames = named
        .filter((pair) => !_.includes(dealtNames, pair.name))
        .map((pair) => pair.name);
    find(named, undealtNames, (value, key) => {
        undealt += `|${key} = ${F.extractText(value)}`;
    });

    undealt += `}}`;
    if (undealt !== '{{head}}')
        result = F.add(result, undealt);

    return result
}

export default head;
