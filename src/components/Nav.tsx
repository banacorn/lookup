import * as React from 'react'
import { connect } from 'react-redux';
import { State, Status, History } from '../types'
import { lookup, backward, forward } from '../actions'
// stylesheets
require('../style/main.less');

interface NavProps extends React.Props<any> {
    word: string,
    status: Status,

    // history
    // history: History,

    onSearch: (e: Event) => void,
    onBackward: (e: Event) => void,
    onForward: (e: Event) => void
};

const mapStateToProps = ({ status, entry }: State) => {
    return {
        word: entry.word,
        status
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSearch: (e: Event) => {
            e.preventDefault(); // prevent submit from refreshing the page
            const searchBox = document.getElementById('search-box') as HTMLInputElement;
            const word: string = searchBox.value;
            dispatch(lookup(word));
        },
        onBackward: (e: Event) => {
            dispatch(backward);
        },
        onForward: (e: Event) => {
            dispatch(forward);
        }
    };
};

class Nav extends React.Component<NavProps, void> {
    render() {
        const { word, status, onSearch, onBackward, onForward } = this.props;
        return (
            <nav id='nav'>
                <button onClick={onBackward}><i className="fa fa-chevron-left" aria-hidden="true"></i></button>
                <button onClick={onForward}><i className="fa fa-chevron-right" aria-hidden="true"></i></button>
                <h1>{ word }</h1>
                <form onSubmit={onSearch}>
                    <input id='search-box' type='text'/>
                </form>
            </nav>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);
