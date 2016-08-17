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

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word } = this.props;
        return (
            <section>
                <h1>{ word }</h1>
            </section>
        )
    }
}

export default connect(
    mapStateToProps
)(Entry);
