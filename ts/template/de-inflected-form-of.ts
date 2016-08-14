import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:de-inflected_form_of
// {{de-inflected form of|ein}}
function deInFlectedFormOf(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    return [
        F.seg(`inflected form of `, true),
        F.seg(`${F.extractText(unnamed[0])}`, false, true)
    ];
}

export default deInFlectedFormOf;
