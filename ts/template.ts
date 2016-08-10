import { Inline } from "./types";
import { plain } from "./parser/element";

function deNoun(params: Inline.Parameter[]): Inline[] {
    console.log(params)
    return [plain("hey")];
}

// https://en.wiktionary.org/wiki/Template:de-noun
function transclude(template: Inline.Template): Inline[] {
    switch (template.name) {
        case "de-noun": return deNoun(template.params);
    }

    return undefined
}

export {
    transclude
}
