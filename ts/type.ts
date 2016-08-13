type RawText = string;
type Word = string;

type RawResponse = {
    word: Word
    text: RawText
};


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
export * from "./type/fmt.ts";
export {
    RawResponse, RawText,
    ParseResult, ParseOk, ParseErr
}
