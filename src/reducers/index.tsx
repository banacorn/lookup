import * as _ from "lodash";
import { A, State } from "../types";

const initialState: State = {
    word: ":D",
    body: ":D"
}

function display(state: State = initialState, action: any): State {
    switch (action.type) {
        case A.JUMP:
            return _.assign({}, state, {
                word: action.word
            })
        case A.RENDER:
            return _.assign({}, state, {
                body: action.body
            })
        default:
            return state
    }
}

export {
    display
}
