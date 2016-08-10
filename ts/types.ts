type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

type Section = {
    header: string,
    body: ParseResult<Paragraph>[],
    subs: Section[]
}

type Paragraph = Line[];

type Line = {
    oli: number,
    uli: number,
    indent: number,
    line: Inline[]
}

//
//  Inline elements
//
type Inline = Inline.Plain
    | Inline.Bold
    | Inline.Italic
    | Inline.Link
    | Inline.Template;
namespace Inline {
    export interface Plain {
        kind: "plain";
        text: string;
    }

    export interface Bold {
        kind: "bold";
        subs: Inline[];
    }

    export interface Italic {
        kind: "italic";
        subs: Inline[];
    }

    export interface Link {
        kind: "link";
        subs: Inline[];
    }

    export type Parameter = {
        name: string,
        value: Inline[]
    };

    export interface Template {
        kind: "template";
        name: string;
        params: Parameter[]
    }
}


//
//  Formatter
//

type Style = {
    i: boolean,     // italic
    b: boolean,     // bold
    a: boolean      // link
};

type Seg = {
    text: string,
    style: Style
};

type Fmt = Seg[];

//
//  Freaking Either
//
type ParseResult<T> = ParseOk<T> | ParseErr;

interface ParseOk<T> {
    kind: "ok";
    value: T;
}

interface ParseErr {
    kind: "err";
    error: string;
}

export {
    Inline, Line, Section, Paragraph,
    RawResponse, Fmt, Seg, RawText,
    ParseResult, ParseOk, ParseErr
}
