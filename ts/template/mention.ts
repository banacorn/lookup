import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";
import { find } from "../template";

// https://en.wiktionary.org/wiki/Template:mention
// {{m|language|link|link_text|translation|tr=transliteration|lit=literal_translation|pos=part_of_speech}}
function mention(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    const language = unnamed[0];
    const link = unnamed[1];
    const linkText = unnamed[2];
    const translation = unnamed[3];

    let showedText = [];
    // showed text
    if (F.extractText(linkText))
        showedText = F.concat(showedText, F.link(F.italic(linkText)));
    else if (F.extractText(link))
        showedText = F.concat(showedText, F.link(F.italic(link)));

    let misc = [F.seg(` (`)];
    let miscComma = false;

    // transliteration
    find(named, "tr", (value) => {
        misc = F.add(misc, `${F.extractText(value)}`);
        miscComma = true;
    });

    // translation
    if (F.extractText(translation)) {
        if (miscComma)
            misc = F.add(misc, `, `);
        misc = F.add(misc, `“`);
        misc = F.concat(misc, F.italic(translation));
        misc = F.add(misc, `”`);
        miscComma = true;
    }

    // part of speech
    find(named, "pos", (value) => {
        if (miscComma)
            misc = F.add(misc, `, `);
        switch (F.extractText(value)) {
            case "a":
                misc = F.add(misc, `adj`);
                break;
            case "adv":
                misc = F.add(misc, `adv`);
                break;
            case "n":
                misc = F.add(misc, `noun`);
                break;
            case "verb":
                misc = F.add(misc, `verb`);
                break;
            default:
                misc = F.add(misc, F.extractText(value));
                break;
        }
        miscComma = true;
    });



    // literal translation
    find(named, "lit", (value) => {
        if (miscComma)
            misc = F.add(misc, `, `);

        misc = F.add(misc, `literally “${F.extractText(value)}“`);
        miscComma = true;
    });

    misc = F.add(misc, `)`);

    if (F.extractText(misc) !== " ()")
        return F.concat(showedText, misc);
    else
        return showedText;
}


export default mention;
