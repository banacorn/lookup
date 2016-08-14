import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import { seg } from "../fmt";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:label
// {{lb|en|AU|slang}}
function label(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {

    let result = [seg(`(`)];
    let commaNext = false;

    // labels
    unnamed.forEach((label, i) => {
        if (commaNext) {
            result = F.add(result, `, `);
        }
        if (i === 0) {
            commaNext = true;
        }

        const text = F.extractText(label);
        switch (text) {
            case "_":
                commaNext = false;
                result = F.add(result, ` `);
                break;
            case "or":
                commaNext = false;
                result = F.add(result, ` or `);
                break;
            case "and":
                commaNext = false;
                result = F.add(result, ` and `);
                break;
            default:
                result = F.add(result, `${text}`);
                commaNext = true;
                break;
        }
    });

    result = F.add(result, `)`);
    return result
}


export default label;
