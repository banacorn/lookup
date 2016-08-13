import { AST, Fmt } from "./type";
import { extractText, fold } from "./fmt";
// import { inspect } from "util";

import deNoun from "./template/de-noun";

function sortParams(params: AST.Parameter[]): {
    named: {
        name: string,
        value: Fmt
    }[],
    unnamed: Fmt[]
} {
    let unnamed = [];
    let named = [];
    params.forEach((param) => {
        const valueFmt = fold([], param.value);
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
    }

    return undefined
}

export {
    transclude,
    sortParams
}
