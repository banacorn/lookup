namespace AST {
    //
    // Block elements
    //

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

    export type Parameter<T> = {
        name: string,
        value: T[]
    };

    export interface Template {
        kind: "template";
        name: string;
        params: Parameter<Inline>[]
    }


    // smart constructors
    export const plain = (s: string) => <AST.Plain>{
        kind: "plain",
        text: s
    }

    export const italic = (xs: AST.Inline[]) => <AST.Italic>{
        kind: "italic",
        subs: xs
    }

    export const bold = (xs: AST.Inline[]) => <AST.Bold>{
        kind: "bold",
        subs: xs
    }

    export const link = (xs: AST.Inline[]) => <AST.Link>{
        kind: "link",
        subs: xs
    }

    export const parameter = (x: string, xs: AST.Inline[]) => <AST.Parameter<AST.Inline>>{
        name: x,
        value: xs
    }

    export const template = (x: string, xs: AST.Parameter<AST.Inline>[]) => <AST.Template>{
        kind: "template",
        name: x,
        params: xs
    }

}

export {
    AST
};
