export type State = {
    word: string,
    body: LanguageSection[]
}

export type Section<T> = {
    name: string,
    body: T,
    subs: Section<T>[]
}

export type BlockElem = Block.Paragraph;
export namespace Block {
    export interface Paragraph {
        kind: 'paragraph',
        body: InlineElem[]
    }
}

export type InlineElem = Inline.Plain | Inline.Italic;
export namespace Inline {
    export interface Plain {
        kind: 'plain',
        text: string
    }
    export interface Italic {
        kind: 'italic',
        body: InlineElem[]
    }
}


export type LanguageSection = {
    languageName: string,
    subs: Section<BlockElem[]>[]
}

export function mapSection<T, U>(f: (t: T) => U, {name, body, subs}: Section<T>): Section<U> {
    return {
        name,
        body: f(body),
        subs: subs.map(s => mapSection(f, s))
    }
}

export function inlineToText(x: InlineElem): string {
    switch (x.kind) {
        case 'plain':
            return x.text;
        case 'italic':
            return x.body.map(inlineToText).join('');
        default:
            return '';
    }
}

export function blockToText(node: BlockElem): string {
    switch (node.kind) {
        case 'paragraph':
            return node.body.map(inlineToText).join('');
        default:
            return "<unknown block element>";
    }
}
