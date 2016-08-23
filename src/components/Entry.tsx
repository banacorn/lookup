import * as React from 'react'
import { connect } from 'react-redux';
import LangSect from './LangSect';
import { State, LanguageSection } from '../types'

interface EntryProps extends React.Props<any> {
    body: LanguageSection[];
};

const mapStateToProps = (state: State) => {
    return {
        body: state.entry.body
    }
}

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { body } = this.props;
        return (
            <section>
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
