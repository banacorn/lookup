import * as _ from "lodash";
import { AST, Fmt } from "../type";
import { sortParams } from "../template";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:de-inflected_form_of
// {{de-inflected form of|ein}}
function deInFlectedFormOf(word: string, raw: AST.Parameter[]): Fmt {
    const {named, unnamed} = sortParams(raw, word);
    return [
        F.seg(`inflected form of `, true),
        F.seg(`${F.extractText(unnamed[0])}`, false, true)
    ];
}

export default deInFlectedFormOf;
