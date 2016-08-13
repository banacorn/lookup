import * as _ from "lodash";
import { AST, Fmt } from "../type";
import { sortParams } from "../template";
import * as F from "../fmt";
// import { inspect } from "util";
// const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);

// {{etyl|src|dst}}
function etyl(word: string, raw: AST.Parameter[]): Fmt {
    const {named, unnamed} = sortParams(raw, word);
    const src = F.extractText(unnamed[0]);
    const dst = F.extractText(unnamed[1]);
    const srcName = languageCode(src);
    if (srcName) {
        return [
            F.seg(`${srcName}`, true, false, false)
        ]
    } else {
        return [
            F.seg(`{{etyl|${src}|${dst}}}`, true, false, false)
        ]
    }
}

function languageCode(code: string): string {
    switch (code) {
        // case "": return "";
        case "ang": return "Old English";
        case "cel-gau": return "Gaulish";
        case "cel-pro": return "Proto-Celtic";
        case "de": return "German";
        case "enm": return "Middle English";
        case "fro": return "Old French";
        case "gem-pro": return "Proto-Germanic";
        case "gmh": return "Middle High German";
        case "gml": return "Middle Low German";
        case "goh": return "Old High German";
        case "ine-pro": return "Proto-Indo-European";
        case "la": return "Latin";
        case "osx": return "Old Saxon";
        default: return undefined;
    }
}

export default etyl;
