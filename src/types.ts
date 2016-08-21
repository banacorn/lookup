export type State = {
    word: string,
    body: LanguageSection[]
}

export type Section<T> = {
    name: string,
    body: T,
    subs: Section<T>[]
}

export type Inline = Plain;

interface Plain {
    kind: 'plain',
    text: string
}


export type LanguageSection = {
    languageName: string,
    subs: Section<string>[]
}

export function mapSection<T, U>(f: (t: T) => U, {name, body, subs}: Section<T>): Section<U> {
    return {
        name,
        body: f(body),
        subs: subs.map(s => mapSection(f, s))
    }
}

export function toText(x: Inline): string {
    switch (x.kind) {
        case 'plain': return x.text;
    }
}
