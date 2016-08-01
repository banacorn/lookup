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
type Language = string;
