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
type Inline = Plain | Bold | Italic | Link;

interface Plain {
    kind: "plain";
    text: string;
}

interface Bold {
    kind: "b";
    subs: Inline[];
}

interface Italic {
    kind: "i";
    subs: Inline[];
}

interface Link {
    kind: "a";
    subs: Inline[];
}

type Parameter = {
    name: string,
    value: Inline[]
};

interface Template {
    kind: "t";
    name: string;
    params: Parameter[]
}


type Fmt = {
    text: string,
    style: string[]
}
