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
    kind: "p"
        | "li"      // * list items
        | "dd"      // # definition description
        | "eg"      // #: example
        | "egt",    // #:: example translation,
    text: string
}

type InlineKind = "span"
                | "a"       // link
                | "i"       // italic
                | "b"       // bold
                | "q"       // quote
                | "t"       // template
type Inline = InlineSimple | Link | Template;

type InlineSimple = {
    kind: "span" | "i" | "b" | "q",
    text: string
}

type Link = {
    kind: "a",
    text: string,
    rename: string
}

type Template = {
    kind: "t",
    name: string,
    params: string[],
    named: {}
}
