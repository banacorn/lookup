type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};

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

export * from "./type/ast.ts";
export {
    RawResponse, Fmt, Seg, RawText,
    ParseResult, ParseOk, ParseErr
}
