import * as React from "react"
import { connect } from "react-redux";
import { State, Action } from "../types"

interface EntryProps extends React.Props<any> {
    word: string;
};

const mapStateToProps = (state: State) => {
    return {
        word: state.word
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
    }
}

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word } = this.props;
        return (
            <article>
                <h1>{ word }</h1>
            </article>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Entry);
