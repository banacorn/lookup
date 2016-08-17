import { A } from "./types";

export const jump = (word: string) => ({
    type: A.JUMP,
    word: word
})

export const render = (body: string) => ({
    type: A.RENDER,
    body: body
})
