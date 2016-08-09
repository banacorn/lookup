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

type Paragraph = any;

type Line = {
    oli: number,
    uli: number,
    indent: number,
    line: Inline[]
}

type Inline = Plain | Bold | Italic | Link | Template;

interface Plain {
    kind: "plain";
    text: string;
}

interface Bold {
    kind: "bold";
    subs: Inline[];
}

interface Italic {
    kind: "italic";
    subs: Inline[];
}

interface Link {
    kind: "link";
    subs: Inline[];
}

type Parameter = {
    name: string,
    value: Inline[]
};

interface Template {
    kind: "template";
    name: string;
    params: Parameter[]
}


type Fmt = {
    text: string,
    style: string[]
}

export {
    Plain, Bold, Italic, Link, Template, Parameter,
    Inline, Line, Section, Paragraph,
    RawResponse, Fmt, RawText,
}
