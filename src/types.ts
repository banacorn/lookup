export namespace A {
    export const JUMP = "JUMP";
    export const RENDER = "RENDER";
}
//
// export type Action = Jump | Render;
//
// export interface Jump {
//     type: "JUMP";
//     word: string;
// }
//
// export interface Render {
//     type: "RENDER";
//     body: string;
// }

export type State = {
    word: string,
    body: string
}
