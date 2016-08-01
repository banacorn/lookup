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
    etymology?: any
    pronouciation?: any
    partOfSpeech: any,
    derivedTerms?: any,
    relatedTerms?: any,
    descendants?: any,
    translations?: any,
    seeAlso?: any,
    references?: any,
    externalLinks?: any
}

// type Pronunciation =
