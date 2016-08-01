type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

type Section = {
    header: string,
    body: RawText,
    subs: Section[]
}

type Entry = Section;

// type Entry = {
//     word: Word,
//     seeAlso?: string,
//     languages: Section[]
// }

type Language = string;

// type LanguageSection = {
//     // alternativeForms?: any[]
//     lang: Language,
//     subs: Section[]
//     // alternativeForms?: any,
//     // etymology?: any[],
//     // pronunciation?: any,
//     // homophones?: any,
//     // rhymes?: any,
//     // partOfSpeech: Section[],
//     // derivedTerms?: any,
//     // relatedTerms?: any,
//     // descendants?: any,
//     // translations?: any,
//     // seeAlso?: any,
//     // references?: any,
//     // externalLinks?: any
// }

// type IPA = {
//     lang: Language,
//     transcriptions: string[]
// }
// type Pronunciation = IPA;
