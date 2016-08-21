export type State = {
    word: string,
    body: LanguageSection[]
}

export type Section<T> = {
    name: string,
    body: T,
    subs: Section<T>[]
}

export type BlockElem = Block.Paragraph | Block.UnorderedList | Block.ListItem;
export namespace Block {
    export interface Paragraph {
        kind: 'p',
        body: InlineElem[]
    }
    export interface UnorderedList {
        kind: 'ul',
        body: ListItem[]
    }
    export interface ListItem {
        kind: 'li',
        body: InlineElem[]
    }
}

export type InlineElem = Inline.Plain | Inline.Italic | Inline.Link;
export namespace Inline {
    export interface Plain {
        kind: 'plain',
        text: string
    }
    export interface Italic {
        kind: 'i',
        body: InlineElem[]
    }
    export interface Link {
        kind: 'a',
        href: string,
        title: string,
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
        case 'i':
            return x.body.map(inlineToText).join('');
        case 'a':
            return x.body.map(inlineToText).join('');
        default:
            return '';
    }
}

export function blockToText(node: BlockElem): string {
    switch (node.kind) {
        case 'p':
            return node.body.map(inlineToText).join('');
        case 'ul':
            return node.body.map(blockToText).join('\n');
        case 'li':
            return node.body.map(inlineToText).join('');
        default:
            return "<unknown block element>";
    }
}
