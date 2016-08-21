import * as React from 'react'
import { connect } from 'react-redux';
import LangSect from './LangSect';
import { State, LanguageSection } from '../types'
import { search } from '../actions'

interface EntryProps extends React.Props<any> {
    word: string;
    subs: LanguageSection[];
    onSearch: (e: Event) => void;
};

const mapStateToProps = (state: State) => {
    return {
        word: state.word,
        subs: state.body
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSearch: (e: Event) => {
            e.preventDefault(); // prevent submit from refreshing the page
            const searchBox = document.getElementById('search-box') as HTMLInputElement;
            const word: string = searchBox.value;
            dispatch(search(word));
        }
    };
};

class Entry extends React.Component<EntryProps, void> {
    render() {
        const { word, subs, onSearch } = this.props;
        return (
            <section>
                <form onSubmit={onSearch}>
                    <input id="search-box" type="text"/>
                </form>
                <h1>{ word }</h1>
                <ul>
                    {subs.map(section =>
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
    mapDispatchToProps
)(Entry);
