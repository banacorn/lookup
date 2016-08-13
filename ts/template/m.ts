import * as _ from "lodash";
import { AST, Fmt } from "../type";
import { sortParams } from "../template";
import * as F from "../fmt";
// import { inspect } from "util";
// const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);

// {{m|language|link|link_text|translation|tr=transliteration|lit=literal_translation|pos=part_of_speech}}

function m(word: string, raw: AST.Parameter[]): Fmt {
    const {named, unnamed} = sortParams(raw, word);

    const language = unnamed[0];
    const link = unnamed[1];
    const linkText = unnamed[2];
    const translation = unnamed[3];
    const transliteration = _.find(named, ["name", "tr"]);
    const partOfSpeech = _.find(named, ["name", "pos"]);

    let showedText = [];
    // showed text
    if (F.extractText(linkText))
        showedText = F.concat(showedText, F.link(F.italic(linkText)));
    else if (F.extractText(link))
        showedText = F.concat(showedText, F.link(F.italic(link)));

    let inParentheses = [F.seg(` (`)];

    // transliteration
    if (transliteration && F.extractText(transliteration.value)) {
        inParentheses = F.add(inParentheses, `${F.extractText(transliteration.value)}`);
    }

    // translation
    if (F.extractText(translation)) {
        if (inParentheses.length > 1)
            inParentheses = F.add(inParentheses, `, `);
        inParentheses = F.add(inParentheses, `“`);
        inParentheses = F.concat(inParentheses, F.italic(translation));
        inParentheses = F.add(inParentheses, `”`);
    }

    // part of speech
    if (partOfSpeech && F.extractText(partOfSpeech.value)) {
        if (inParentheses.length > 1)
            inParentheses = F.add(inParentheses, `, `);
        switch (F.extractText(partOfSpeech.value)) {
            case "a":
                inParentheses = F.add(inParentheses, `adj`);
                break;
            case "adv":
                inParentheses = F.add(inParentheses, `adv`);
                break;
            case "n":
                inParentheses = F.add(inParentheses, `noun`);
                break;
            case "verb":
                inParentheses = F.add(inParentheses, `verb`);
                break;
            default:
                inParentheses = F.add(inParentheses, F.extractText(partOfSpeech.value));
                break;
        }
    }

    // // literal translation
    if (transliteration && F.extractText(transliteration.value)) {
        if (inParentheses.length > 1)
            inParentheses = F.add(inParentheses, `, `);
        inParentheses = F.add(inParentheses, `literally “${F.extractText(transliteration.value)}“`);
    }

    inParentheses = F.add(inParentheses, `)`);

    if (F.extractText(inParentheses) !== " ()")
        return F.concat(showedText, inParentheses);
    else
        return showedText;
}


export default m;
