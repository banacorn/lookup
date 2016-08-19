import * as React from 'react'
import { connect } from 'react-redux';
import LangSect from './LangSect';
import { State, LanguageSection } from '../types'

interface EntryProps extends React.Props<any> {
    word: string;
    subs: LanguageSection[];
};

const mapStateToProps = (state: State) => {
    return {
        word: state.word,
        subs: state.body
    }
}

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word, subs } = this.props;
        return (
            <section>
                <h1>{ word }</h1>
                <ul>
                    {subs.map(section =>
                        <LangSect
                            key={word + `-` + section.languageName}
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
    mapStateToProps
)(Entry);
