export type State = {
    word: string,
    body: LanguageSection[]
}

export type Section<T> = {
    name: string,
    body: T,
    subs: Section<T>[]
}

export type LanguageSection = {
    languageName: string,
    subs: Section<any>[]
}

export function mapSection<T, U>(f: (t: T) => U, {name, body, subs}: Section<T>): Section<U> {
    return {
        name,
        body: f(body),
        subs: subs.map(s => mapSection(f, s))
    }
}
