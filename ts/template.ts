import { AST, Fmt } from "./type";
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
import m from "./template/m";
import ipa from "./template/ipa";
import rhymes from "./template/rhymes";

function sortParams(params: AST.Parameter[], word: string): {
    named: {
        name: string,
        value: Fmt
    }[],
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
    switch (template.name) {
        case "a": return a(word, template.params);
        case "audio": return audio(word, template.params);
        case "de-noun": return deNoun(word, template.params);
        case "de-verb form of": return deVerbFormOf(word, template.params);
        case "de-form-adj": return deFormAdj(word, template.params);
        case "de-inflected form of": return deInFlectedFormOf(word, template.params);
        case "etyl": return etyl(word, template.params);
        case "head": return head(word, template.params);
        case "homophones": return homophones(word, template.params);
        case "hyphenation": return hyphenation(word, template.params);
        case "lb":
        case "lbl":
        case "lable":
            return label(word, template.params);
        case "m": return m(word, template.params);
        case "IPA": return ipa(word, template.params);
        case "rhymes": return rhymes(word, template.params);
    }
    return undefined
}

export {
    transclude,
    sortParams
}
