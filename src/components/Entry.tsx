import * as React from 'react'
import { connect } from 'react-redux';
import { State } from '../types'

interface EntryProps extends React.Props<any> {
    word: string;
    body: string[];
};

const mapStateToProps = (state: State) => {
    console.info(state.body)
    console.info(state.body.map)
    return {
        word: state.word,
        body: state.body.map(section => section.name)
    }
}

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word, body } = this.props;
        return (
            <section>
                <h1>{ word }</h1>
                <ul>
                    {body.map(val =>
                        <li key={word + `-` + val}>{val}</li>
                    )}
                </ul>
            </section>
        )
    }
}

export default connect(
    mapStateToProps
)(Entry);
