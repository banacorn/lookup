type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

type Section = {
    header: string,
    body: RawText
}

type Entry = {
    word: Word,
    seeAlso?: string
    languages: LanguageEntry[]
}

type Language = string;

type LanguageEntry = {
    // alternativeForms?: any[]
    language: Language,
    alternativeForms?: any,
    etymology?: any[],
    pronunciation?: any,
    homophones?: any,
    rhymes?: any,
    partOfSpeech: Section[],
    derivedTerms?: any,
    relatedTerms?: any,
    descendants?: any,
    translations?: any,
    seeAlso?: any,
    references?: any,
    externalLinks?: any
}

type IPA = {
    lang: Language,
    transcriptions: string[]
}
type Pronunciation = IPA;
