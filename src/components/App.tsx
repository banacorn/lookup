import * as React from 'react'
import { connect } from 'react-redux';
import { State } from '../types'

import Entry from './Entry';
import Nav from './Nav';

interface AppProps extends React.Props<any> {
    // word: string;
    // subs: LanguageSection[];
    // lookupStatus: "pending" | "succeed" | "failed",
    // onSearch: (e: Event) => void;
};

const mapStateToProps = (state: State) => {
    return {
        // word: state.word,
        // subs: state.body,
        // lookupStatus: state.lookupStatus,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        // onSearch: (e: Event) => {
        //     e.preventDefault(); // prevent submit from refreshing the page
        //     const searchBox = document.getElementById('search-box') as HTMLInputElement;
        //     const word: string = searchBox.value;
        //     dispatch(search(word));
        // }
    };
};

class App extends React.Component<AppProps, void> {
    render() {
        // const { word, subs, onSearch, lookupStatus } = this.props;
        return (
            <article>
                <Nav />
                <Entry />
            </article>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
