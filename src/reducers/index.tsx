import { Action } from "../types"

function display(state = { word: "Eis" }, action: any) {
    switch (action.type) {
        case Action.DISPLAY:
            return {
                word: action.word
            }
        default:
            return state
    }
}

export {
    display
}
