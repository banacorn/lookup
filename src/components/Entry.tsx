import * as React from "react"
import { connect } from "react-redux";
import { State, A } from "../types"

interface EntryProps extends React.Props<any> {
    word: string;
    body: string;
};

const mapStateToProps = (state: State) => {
    return {
        word: state.word,
        body: state.body
    }
}

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word, body } = this.props;
        return (
            <section>
                <h1>{ word }</h1>
                <p>{ body }</p>
            </section>
        )
    }
}

export default connect(
    mapStateToProps
)(Entry);
