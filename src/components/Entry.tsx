import * as React from 'react'
import { connect } from 'react-redux';
import LangSect from './LangSect';
import { State, LanguageSection } from '../types'

interface EntryProps extends React.Props<any> {
    word: string;
    body: LanguageSection[];
};

const mapStateToProps = (state: State) => {
    return state.entry
}

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word, body } = this.props;
        return (
            <section>
                <h1>{ word }</h1>
                <ul>
                    {body.map(section =>
                        <LangSect
                            key={section.languageName}
                            languageName={section.languageName}
                            subs={section.subs}
                        />
                    )}
                </ul>
            </section>
        )
    }
}

export default connect(
    mapStateToProps,
    null
)(Entry);
