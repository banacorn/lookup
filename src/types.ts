export type State = {
    word: string,
    body: Section<string>[]
}

export type Section<T> = {
    name: string,
    body: T,
    subs: Section<T>[]
}

export function mapSection<T, U>(f: (t: T) => U, {name, body, subs}: Section<T>): Section<U> {
    return {
        name,
        body: f(body),
        subs: subs.map(s => mapSection(f, s))
    }
}
