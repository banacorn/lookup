import { AST, Fmt } from "./type";
import { fold } from "./fmt";
// import { inspect } from "util";

import deNoun from "./template/de-noun";
import etyl from "./template/etyl";
import m from "./template/m";
import ipa from "./template/ipa";

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
        case "de-noun": return deNoun(word, template.params);
        case "etyl": return etyl(word, template.params);
        case "m": return m(word, template.params);
        case "IPA": return ipa(word, template.params);
    }
    return undefined
}

export {
    transclude,
    sortParams
}
