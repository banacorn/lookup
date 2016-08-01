type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

type Section = {
    header: string,
    body: Paragraph,
    subs: Section[]
}

type Paragraph = Line[];
type Line = {
    type: "p"
        | "li"      // * list items
        | "dd"      // # definition description
        | "eg"      // #: example
        | "egt",    // #:: example translation,
    text: string
}
