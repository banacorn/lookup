type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

type Section = {
    header: string,
    body: Paragraph[],
    subs: Section[]
}

type Paragraph = Line[];

type Line = RawText;
// type Line = {
//     kind: "p"
//         | "li"      // * list items
//         | "dd"      // # definition description
//         | "eg"      // #: example
//         | "egt",    // #:: example translation,
//     text: Inline[]
// }

// type InlineKind = "span"
//                 | "a"       // link
//                 | "i"       // italic
//                 | "b"       // bold
//                 | "t"       // template
type Inline = InlineSimple | Link | Template;

type InlineSimple = {
    kind: "span" | "i" | "b",
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

type Fmt = {
    text: string,
    style: string[]
}
