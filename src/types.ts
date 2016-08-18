export type State = {
    word: string,
    body: Section[]
}

export type Section = {
    name: string,
    body: any,
    subs: Section[]
}
