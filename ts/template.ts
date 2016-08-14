import { AST, Fmt, Seg } from "./type";
import { fold } from "./fmt";
// import { inspect } from "util";

import a from "./template/a";
import audio from "./template/audio";
import deNoun from "./template/de-noun";
import deVerbFormOf from "./template/de-verb-form-of";
import deFormAdj from "./template/de-form-adj";
import deInFlectedFormOf from "./template/de-inflected-form-of";
import etyl from "./template/etyl";
import head from "./template/head";
import homophones from "./template/homophones";
import hyphenation from "./template/hyphenation";
import label from "./template/label";
import mention from "./template/mention";
import ipa from "./template/ipa";
import rhymes from "./template/rhymes";

function sortParams(params: AST.Parameter<AST.Inline>[], word: string): {
    named: AST.Parameter<Seg>[]
    unnamed: Fmt[]
} {
    let unnamed = [];
    let named = [];
    params.forEach((param) => {
        const valueFmt = fold([], param.value, word);
        if (param.name === "") {
            unnamed.push(valueFmt);
        } else {
            named.push({
                name: param.name,
                value: valueFmt
            });
        }
    })
    return {
        named: named,
        unnamed: unnamed
    }
}


// https://en.wiktionary.org/wiki/Template:de-noun
function transclude(word: string, template: AST.Template): Fmt {
    const {named, unnamed} = sortParams(template.params, word);

    switch (template.name) {
        case "a": return a(word, named, unnamed);
        case "audio": return audio(word, named, unnamed);
        case "de-noun": return deNoun(word, named, unnamed);
        case "de-verb form of": return deVerbFormOf(word, named, unnamed);
        case "de-form-adj": return deFormAdj(word, named, unnamed);
        case "de-inflected form of": return deInFlectedFormOf(word, named, unnamed);
        case "etyl": return etyl(word, named, unnamed);
        case "head": return head(word, named, unnamed);
        case "homophones": return homophones(word, named, unnamed);
        case "hyphenation": return hyphenation(word, named, unnamed);
        case "lb":
        case "lbl":
        case "lable":
            return label(word, named, unnamed);
        case "m":
        case "mention":
            return mention(word, named, unnamed);
        case "IPA": return ipa(word, named, unnamed);
        case "rhymes": return rhymes(word, named, unnamed);
    }
    return undefined
}

export {
    transclude,
    sortParams
}
