import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";
import { find, findEnum } from "../template";

// import { inspect } from "util";
// const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);

// https://en.wiktionary.org/wiki/Template:compound
// {{compound|(language code)|first part|second part|optionally more parts}}
function compound(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {

    // displayed texts
    let components: Fmt[] = unnamed.map(F.italic);
    // search for alternative texts
    findEnum(named, "alt", (value, i, key) => {
        // replace with alternative text
        components[i - 1] = value;
    })

    // initalize miscs with []s
    let componentMiscs: Fmt[][] = components.map(() => []);

    // transliterations
    findEnum(named, "tr", (value, i, key) => {
        componentMiscs[i - 1].push(value);
    });

    // glosses
    findEnum(named, ["t", "gloss"], (value, i, key) => {
        let gloss = [];
        gloss = F.add(gloss, `“`);
        gloss = F.concat(gloss, value);
        gloss = F.add(gloss, `”`);
        componentMiscs[i - 1].push(gloss);
    });

    // POS
    findEnum(named, "pos", (value, i, key) => {
        componentMiscs[i - 1].push(value);
    });

    // join miscs with commas ", "
    const delimetedMiscs = componentMiscs.map((miscs: Fmt[]) => {
        return F.join(miscs, [F.seg(`, `)]);
    })

    // component + (misc ...)
    const joinedWithMiscs = components.map((component, i) => {
        if (delimetedMiscs[i].length > 0)
            return F.concat(component, F.concat([F.seg(` `)], F.parentheses(delimetedMiscs[i])));
        else
            return component;
    });

    return F.join(joinedWithMiscs, [F.seg(` + `)]);
}

export default compound;
