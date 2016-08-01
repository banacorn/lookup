type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

type Section = {
    header: string,
    content: RawText
}

type Entry = {
    word: Word,
    seeAlso?: string
    languages: Section[]
}

type EntryLanguage = {
    // alternativeForms?: any[]
    etymology?: any
    pronouciation?: any
    partOfSpeech: any
}
