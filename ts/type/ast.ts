import { ParseResult } from "../type";

namespace AST {
    //
    // Block elements
    //

    export type Section = {
        header: string,
        body: ParseResult<Paragraph>[],
        subs: Section[]
    }

    export type Paragraph = Line[];

    export type Line = {
        oli: number,
        uli: number,
        indent: number,
        line: Inline[]
    }

    //
    //  Inline elements
    //
    export type Inline = Plain
        | Bold
        | Italic
        | Link
        | Template;

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

export {
    AST
};
