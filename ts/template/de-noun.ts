import * as _ from "lodash";
import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";
import { find, findEnum } from "../template";

// import { inspect } from "util";
// const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);

type Gender = string;
type Genitive = string;
type Plural = string;
type Diminutive = string;
type GenderedForm = string;

// {{de-noun|Gender|Genitive|Plural|Diminutive|Gendered forms}}
function deNoun(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    let result = [F.seg(`${word} `, false, true)];

    //  == Gender ==
    //  "Use m as the first parameter to indicate masculine gender, f for
    //  feminine, n for neuter. To specify more than one gender, use g2= or g3=.
    //  If you're not sure about the gender, use g as the gender or just leave
    //  it empty."
    const genderForm = parseGender(unnamed[0]);
    result = F.add(result, `${genderForm}`, true, false, true);

    const otherGenderForms = findEnum(named, "g", (value) => {
        result = F.add(result, `, `);
        result = F.add(result, `${F.extractText(value)}`, true, false, true);
    })

    //  == Genitive ==
    //  Use the second parameter to specify the genitive form of the noun.
    //  If left empty, it defaults to the headword + s if it's masculine or
    //  neuter, and to the headword alone if it's feminine.
    //  Additional genitive forms can be added with gen2= and gen3=.
    const genitiveForm = determineGenitive(unnamed[1], _.concat([genderForm], otherGenderForms.map(F.extractText)), word);
    result = F.add(result, ` (`, false);
    result = F.add(result, `genitive`, true);
    result = F.add(result, ` ${genitiveForm}`);

    findEnum(named, "gen", (value) => {
        result = F.add(result, ` or`, true);
        result = F.add(result, ` ${F.extractText(value)}`);
    })

    //  == Plural ==
    //  Use the third parameter to specify the plural form of the noun.
    //  If left empty, it defaults to the headword + en. It can also be set to
    //  - to indicate there is no plural form for this noun.
    //  Additional plural forms can be added with pl2= and pl3=.
    const pluralForm = determinePlural(unnamed[2], word);
    if (pluralForm) {
        result = F.add(result, `, `,);
        result = F.add(result, `plural`, true);
        result = F.add(result, ` ${pluralForm}`);
    } else {
        result = F.add(result, `, `,);
        result = F.add(result, `no plural`, true);
    }
    findEnum(named, "pl", (value) => {
        result = F.add(result, ` or`, true);
        result = F.add(result, ` ${F.extractText(value)}`);
    });

    //  == Diminutive ==
    //  Use the fourth parameter to specify the diminituve form of the noun.
    //  If left empty, no diminutive is displayed.
    //  Additional diminutive forms can be added with dim2=.
    const diminutiveForm = determineDiminutive(unnamed[3]);
    if (diminutiveForm) {
        result = F.add(result, `, `,);
        result = F.add(result, `diminutive`, true);
        result = F.add(result, ` ${diminutiveForm} `,);
        result = F.add(result, `n`, true, false, true);
    }

    //  == Gendered forms ==
    //  Use f= to specify the equivalent feminine form of a masculine noun.
    //  Use m= to specify the equivalent masculine form of a feminine noun.
    //  These are used especially with nouns denoting professions.
    find(named, "f", (value) => {
        result = F.add(result, `, `,);
        result = F.add(result, `feminine`, true);
        result = F.add(result, ` ${F.extractText(value)}`);
    })

    find(named, "m", (value) => {
        result = F.add(result, `, `,);
        result = F.add(result, `masculine`, true);
        result = F.add(result, ` ${F.extractText(value)}`);
    })

    result = F.add(result, `)`);
    return result;
}

function determineGenitive(raw: Fmt, genderForms: Gender[], word: string): Genitive {
    // use default
    if (_.isEmpty(raw)) {
        if (_.includes(genderForms, "m") || _.includes(genderForms, "n")) {
            return `${word}s`;  // headword + s
        } else {
            return `${word}`;
        }
    } else {
        return F.extractText(raw);
    }
}

function determinePlural(raw: Fmt, word: string): Plural {
    // use default
    if (_.isEmpty(raw)) {
        return `${word}en`;     // headword + en
    } else if (F.extractText(raw) === "-") {
        return undefined
    } else {
        return F.extractText(raw);
    }
}

function determineDiminutive(raw: Fmt): Diminutive {
    // use default
    if (_.isEmpty(raw)) {
        return undefined
    } else {
        return F.extractText(raw);
    }
}

function parseGender(raw: Fmt): Gender {
    return F.extractText(raw).substr(0, 1);
    // switch (F.extractText(raw)) {
    //     case "m": return "masculine";
    //     case "m-s": return "masculine";
    //     case "m-p": return "masculine";
    //     case "f": return "feminine";
    //     case "f-s": return "feminine";
    //     case "f-p": return "feminine";
    //     case "n": return "neuter";
    //     case "n-s": return "neuter";
    //     case "n-p": return "neuter";
    //     case "?-p": return "?";
    //     case "?-s": return "?";
    //     case "?-p": return "?";
    //     case "p": return "?";
    //     default: return "?";
    // }
}


export default deNoun;
