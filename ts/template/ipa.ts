import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";
// import { inspect } from "util";
// const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);

// {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
function ipa(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    let result = [F.seg(`IPA: `)];

    // pronunciations
    unnamed.forEach((pronunciation, i) => {
        if (i !== 0)
            result = F.add(result, `, `);
        result = F.add(result, `${F.extractText(pronunciation)}`, false, true);
    });

    return result
}

export default ipa;
